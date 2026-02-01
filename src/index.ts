import { errorHandler } from '@middlewares/error.middleware';
import app from './app';
import userRoutes from "@modules/user/user.routes"
import authRoutes from '@modules/auth/auth.routes'
import productRoutes from '@modules/product/product.routes'
import { requireAuth } from '@middlewares/requiresAuth';


const PORT = process.env.PORT || 4000;


app.use('/api/auth',authRoutes)

app.use(requireAuth)

app.use('/api/user',userRoutes)
app.use('/api/product',productRoutes)

app.use(errorHandler)

app.listen(PORT,function(){
    console.log("API LISTENING AT PORT" + ' ' + PORT);
})