import { json } from "@remix-run/node";

export const action = async ({ request }) => {

    switch (request.method) {
        case "DELETE": {
            try {

                // console.log('data for delete................,..............,;........', );

                // const response = await discountModel.findByIdAndDelete(data._id);

                // if (response) {
                //     return json({
                //         success: "Data Deleted Successfully."
                //     });

                // } else {
                //     return json({
                //         error: "Something went wrong...",
                //         response: response

                //     });
                // }

            } catch (error) {
                console.log("error", error)
                return json({
                    error: "Something went wrong..."
                });
            }
        }
    }
};