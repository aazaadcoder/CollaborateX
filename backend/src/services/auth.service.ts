import { ProvideEnum } from './../enums/account.provider';

import mongoose from "mongoose";
import UserModel from "../models/user.model";
import accountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import { BadRequestException, NotFoundException, UnauthorizedAccessException } from "../utils/appError.util";
import MemberModel from "../models/member.model";


export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { email, provider, providerId, displayName, picture } = data;

    // will start a session 
    const session = await mongoose.startSession();
    try {

        // will start the transaction 
        session.startTransaction();

        // will check if user already exits in db
        let user = await UserModel.findOne({ email }, null, { session });

        if (!user) {
            // create user if not exist
            user = new UserModel(
                {
                    email,
                    name: displayName,
                    profilePicture: picture || null,
                }
            );

            await user.save({ session });
            console.log(user)

            // now we will create an account for the user

            const account = new accountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            })

            await account.save({ session });

            // now we will create a new worksapce for the new user

            const workspace = new WorkspaceModel({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id
            })

            await workspace.save({ session });

            // fetching owner roles from the role collection as will have to create a member doccuement for this user and its wokrspace and will have to specify the role of this user in its workspace

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }, null, { session });

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found ");
            }

            // now we create a member document fot the current user and its workspace and its role

            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            })

            await member.save({ session });

            // now we will update the currentWorkspace field of the current user which is null as of now 

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            // tostudy : as  mongoose.Types.ObjectId is a ts type assesertion 

            await user.save({ session });
        }

        // we will commit transation when all actions are done
        await session.commitTransaction();

        // now we will return an object with user object as one of it key
        return { user };

    } catch (error) {
        await session.abortTransaction();

        throw error;

    } finally {
        // end the session 
        session.endSession()

    }
}

export const registerUserService = async (body: {
    email: string,
    name: string,
    password: string
}) => {
    const { email, name, password } = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const existingUser = await UserModel.findOne({ email }, null, { session });

        // checking if user already exists and throw error if so
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        // create a user doccument for the new user
        const user = new UserModel({
            email,
            name,
            password
        });

        await user.save({ session });

        // creating a new account document for the new user using email as the provider
        const account = new accountModel({
            userId: user._id,
            provider: ProvideEnum.EMAIL,
            providerId: email,
        })

        await account.save({ session });

        // now creating a new workspace for the new user
        const workspace = new WorkspaceModel({
            name: "My Workspace",
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        })

        await workspace.save({ session });

        // mow we will fetch role document for the role of owner as after this we will create a member document for the new user and we need role id for that

        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER
        }, null, { session });

        if (!ownerRole) {
            throw new NotFoundException("Owner role not found");
        }

        // now we will create the member document for the new user

        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        })

        await member.save({ session });

        // now we will set the workspace created above as the currentworksapce of the new user

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

        await user.save({ session });

        // we will commit all the transactions
        await session.commitTransaction();
        // anything related to transaction returns a promise

        return ({
            userId: user._id,
            workspaceId: workspace._id,
        })

    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
}

export const verifyUserService = async ({ email, password, provider = ProvideEnum.EMAIL
}: { email: string, password: string, provider?: string }) => {
    // check if account with this local provider, and its providerid that is email exists or not
    const account = await accountModel.findOne({provider, providerId : email});
    
    if(!account){
        // if user doesnot exist thorw an error
        throw new NotFoundException("Invalid Email or Password");
    }

    // if account for this email exists , retrive the user data from user collection 
    const user = await UserModel.findById(account.userId);

    // if user for this account doesnot exists throw a not found error
    if(!user){
        throw new NotFoundException("User with this account doesnot exist");
    }

    // if user exists compare password given by user with the one stored in db
    const isPasswordMatch = await user.comparePassword(password);

    // if passwords donot match throw a unauthrizedexpection error
    if(!isPasswordMatch){
        throw new UnauthorizedAccessException("Invalid email or passoword");
    }

    // if password matches return the user documnet without the passoword
    return user.omitPassword();
}