/* 
Handles calls to the config table
 */

import { NextApiRequest, NextApiResponse } from "next";
import { checkIsInSession } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";


export default checkIsInSession( 
    async (req: NextApiRequest, res: NextApiResponse) => {    
        try {
            if (req.method === 'GET') {
                const value = await prisma.config.findUnique({
                    select: {
                        value: true
                    },
                    where: {
                        key: req.body.key
                    }
                })
                res.status(200).json(value);
            }
            else if (req.method === 'PUT') {

                try {
                    await prisma.config.upsert({
                        where: { key: req.body.key },
                        update: {
                            value: req.body.value
                        },
                        create: {
                            key: req.body.key,
                            value: req.body.value
                        }
                    });
                    res.status(200).json({status: 'updated homepage picture'});
                } catch (e) {
                    res.status(500).json({error: 'Internal server error', msg: e.message});
                }
                
            } else {
                res.status(500).json({error: 'config route for this http request type not supported'});
            }
        }catch(error){
            res.status(500).json({error: error.message});
        }
        
    }
) 