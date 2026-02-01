import { errorHandler } from '@middlewares/error.middleware';
import app from './app';
import userRoutes from "@modules/user/user.routes"


const PORT = process.env.PORT || 4000;



app.use('/api/user',userRoutes)


app.use(errorHandler)

app.listen(PORT,function(){
    console.log("API LISTENING AT PORT" + ' ' + PORT);
})