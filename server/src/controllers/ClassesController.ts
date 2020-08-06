import { Request, Response} from 'express';

import db from '../database/connection';
import convertHourToMinuters from '../Utils/convertHourToMinuters';


interface SchaduleItem {
    week_day: number;
    from: string;
    to:string;
};

export default class ClassController {

    async index(request: Request, response: Response){
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time ){
           return response.status(400).json({
               error: 'Missing filters to search class'
           }) 
        }
           const timeInMinutes = convertHourToMinuters(time);

           const classes = await db('classes')
            .whereExists(function(){
                this.select('classes_schadule.*')
                .from('classes_schadule')
                .whereRaw('`classes_schadule`.`class_id` = `classes`.`id`')
                .whereRaw('`classes_schadule`.`week_day` = ??',[Number(week_day)])
                .whereRaw('`classes_schadule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`classes_schadule`.`from` > ??', [timeInMinutes])
            })

            .where('classes.subject', '=', subject)
            .join('users','classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

           return response.json(classes);   
    }

    async create(request: Request, response: Response){
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schadule
        } = request.body;
    
        const trx = await db.transaction();
    
        try {
            
    
    
        const insertedUsersIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
        });
    
        const user_id = insertedUsersIds[0];
    
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id,
        });
    
        const class_id = insertedClassesIds[0];
    
        const classSchadule = schadule.map((schaduleItem: SchaduleItem) => {
            return{
                class_id,
                week_day:schaduleItem.week_day,
                from: convertHourToMinuters(schaduleItem.from),
                to: convertHourToMinuters(schaduleItem.to),
            };
        });
        
        await trx('classes_schadule').insert(classSchadule);
    
        await trx.commit();
    
        return response.status(201).send();   
             
        } catch (err) {
            console.log(err);
            await trx.rollback();

            return response.status(400).json({
                error: 'UNEXPECTED ERROR WHILE CREATING NEW CLASS'
            })
        }
    
    }
}