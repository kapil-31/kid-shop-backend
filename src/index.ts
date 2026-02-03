import { errorHandler } from '@middlewares/error.middleware';
import app from './app';
import userRoutes from "@modules/user/user.routes"
import authRoutes from '@modules/auth/auth.routes'
import productRoutes from '@modules/product/product.routes'
import categoryRoutes from '@modules/category/category.routes'
import couponRoutes from '@modules/coupon/coupon.routes'
import fileUploadRoutes from '@modules/file-upload/upload.routes'
import { requireAuth } from '@middlewares/requiresAuth';


const PORT = process.env.PORT || 4000;


app.use('/api/auth',authRoutes)


app.use('/api/user',userRoutes)

app.use(requireAuth)

app.use('/api/product',productRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/coupon',couponRoutes)
app.use('/api/upload',fileUploadRoutes)


app.use(errorHandler)

app.listen(PORT,function(){
    console.log("API LISTENING AT PORT" + ' ' + PORT);
})