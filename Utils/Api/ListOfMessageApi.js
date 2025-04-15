import { executePost } from "../ServiceMethods";

export const ListOfMessageApi = async (data) => {
    
    try {
        console.log(data,"payload")
        const messagelist = await executePost("/vms/chat/message",data);
        const listOfMessage = messagelist.data ? messagelist.data : {};
        console.log(listOfMessage,"listOfMessage")
        return listOfMessage;
    } catch (error) {
        return error;
    }
};


// {"data": [{"business_id": 59, "business_name": "Green Haven Gardens", "channel_id": "msd_4_voucher_559", "chat_type": "2", "comm_id": 65, "created_at": "Wed, 14 Aug 2024 07:17:37 GMT", "endUser_id": 4, "help_reason": "hi siddhant", "product_id": 559, "product_image": "products/voucher_images/voucher_2024-08-09-12-20-00_59.png", "product_name": "Get 15% OFF", "product_type": "1", "updated_at": "Wed, 14 Aug 2024 09:13:38 GMT"}, {"business_id": 47, "business_name": "Momos Point", "channel_id": "msd_4_voucher_581", "chat_type": "2", "comm_id": 66, "created_at": "Wed, 14 Aug 2024 08:55:30 GMT", "endUser_id": 4, "help_reason": "gfgdtgf", "product_id": 581, "product_image": "products/voucher_images/voucher_2024-07-30-06-15-25_47.png", "product_name": "test", "product_type": "1", "updated_at": "Wed, 14 Aug 2024 09:04:16 GMT"}], "message": "User Chat History", "status": 200, "success": true} 