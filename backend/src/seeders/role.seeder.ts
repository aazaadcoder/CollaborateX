import "dotenv/config";
import mongoose from 'mongoose';
import connectDataBase from '../config/database.config';
import { RolePermission } from '../utils/role-persmission';
import RoleModel from '../models/role-permission.model';

const seedRoles = async () => {
    console.log("seeding roles started");

    await connectDataBase();

    const session = await mongoose.startSession();
    try {
        // we will use this session in all the communication with db for this transaction 

        await session.startTransaction();


        // deleting all the exisiting roles 
        console.log("Deleting Existing roles...");
        await RoleModel.deleteMany({}, { session });


        //now trying to save all the role and their respective permission array 
        for (const roleName in RolePermission) {
            const role = roleName as keyof typeof RolePermission; //Trust me, roleName is a valid key in RolePermission

            const permissions = RolePermission[role];

            // check if role already exists 

            const exisitingRole = await RoleModel.findOne({ name: role }, null, { session });


            // create the nwe role document
            if (!exisitingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions
                })
                // save the new role doccument
                await newRole.save({ session });
                console.log(`role : ${role} add with permission `)
            }
            else {
                console.log(`role : ${role} already exists`)
            }
        }
        // commiting the transactions ain the session
        await session.commitTransaction();
        console.log("transactions commited");



        // here we are done with seeding 
        console.log("seeding completed");
    } catch (error) {

        //abort the transaction as there is an error and rollback all the changes done in the transaction if any before the error occured 
        await session.abortTransaction();
        console.log("error during seeding", error);
    } finally {
        // ending the session 
        session.endSession();
        console.log("session ended");
    }
}

seedRoles().catch((error) => console.error("Errot while runnign seeding script", error));