import cron from 'node-cron';
import moment from 'moment'
import { deleteDraftOrder } from '../graphql/deleteDraftOrder';
import { DraftOrderModel } from '../db.server';
import { shopModel } from '../db.server';

export async function deleteDraftCron() {

    const shopData = await shopModel.findOne();


    const task = async () => {
        try {
            // console.log('Task executed at:', new Date(), shopData);

            const fifteenMinutesAgo = moment().subtract(15, 'minutes').toISOString();


            const response = await deleteDraftOrder({
                shopData,
                accessToken: shopData.accessToken,
                fifteenMinutesAgo
            });

            if (response.status) {
                console.log('success response from cron: ', response.data?.data)
                // for deleting from mongodb database 
                const deletionResult = await DraftOrderModel.deleteMany({
                    createdAt: {
                        $lt: fifteenMinutesAgo
                    }
                });
                console.log('deletionResult', deletionResult);
            } else {
                console.log('error response from cron: ', response.data?.data)
            }


        } catch (error) {
            console.error('Error in task execution:', error.message);
        }
    };
    // task()

    const sheduledTime = '0 */2 * * *';  // cron job to run every 2 hours

    // '0 */2 * * *';  // to run every 2 hours

    // '*/10 * * * * *' // to run every 10 seconds

    const scheduledJob = cron.schedule(sheduledTime, task);

    scheduledJob.on('error', (err) => {
        console.error('Error in cron scheduling:', err.message);

    });

    console.log('Cron job scheduled to run every 2 hours');

}



