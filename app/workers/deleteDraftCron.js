import cron from 'node-cron';
import moment from 'moment'
import { deleteDraftOrder } from '../graphql/deleteDraftOrder';
import { DraftOrderModel } from '../db.server';

export async function deleteDraftCron() {

    const task = async () => {
        try {
            console.log('Task executed at:', new Date());

            // const response = await deleteDraftOrder();

            const tenMinutesAgo = moment().subtract(10, 'minutes');

            const foundData = await DraftOrderModel.find({
                createdAt: {
                    $gte: tenMinutesAgo.toISOString(),
                    $lte: new Date().toISOString()
                }
            });

            console.log('Found data:', foundData);


        } catch (error) {
            console.error('Error in task execution:', error.message);
        }
    };
    task()

    const sheduledTime = '0 */2 * * *';  // cron job to run every 2 hours

    // '0 */2 * * *';  // cron job to run every 2 hours

    // '*/10 * * * * *' // cron job to run every 10 seconds

    const scheduledJob = cron.schedule(sheduledTime, task);

    scheduledJob.on('error', (err) => {
        console.error('Error in cron scheduling:', err.message);

    });

    console.log('Cron job scheduled to run every 2 hours');

}



