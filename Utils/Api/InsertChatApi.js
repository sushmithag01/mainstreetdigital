
import { executePost } from "../ServiceMethods";


export const InsertChatApi = async (MessageData) => {
    
    try {
        const insertMessage = await executePost("/vms/chat/message",MessageData);
        const insertMessageData = insertMessage.data ? insertMessage.data : {};
        return insertMessageData;
    } catch (error) {
        
        return error;
    }
};