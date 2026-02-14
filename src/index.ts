import { errorHandler } from '@middlewares/error.middleware';
import app from './app';
import userRoutes from "@modules/user/user.routes"
import authRoutes from '@modules/auth/auth.routes'
import productRoutes from '@modules/product/product.routes'
import categoryRoutes from '@modules/category/category.routes'
import couponRoutes from '@modules/coupon/coupon.routes'
import fileUploadRoutes from '@modules/file-upload/upload.routes'
import galleryRoutes from '@modules/gallery/gallery.route'
import bannerRoutes from '@modules/banner/banner.route'

import addToCartRoutes from '@modules/cart/cart.routes'

const PORT = process.env.PORT || 4000;


app.use('/api/auth',authRoutes)


app.use('/api/users',userRoutes)

app.use('/api/products',productRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/coupons',couponRoutes)
app.use('/api/upload',fileUploadRoutes)
app.use('/api/gallery',galleryRoutes)
app.use('/api/banner',bannerRoutes)
app.use('/api/cart',addToCartRoutes)


app.use(errorHandler)

app.listen(PORT,function(){
    console.log("API LISTENING AT PORT" + ' ' + PORT);
})