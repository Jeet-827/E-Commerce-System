import razor from "razorpay"

const rzp=new razor({
    key_id:process.env.RAZOR_1,
    key_secret:process.env.RAZOR_2
})

export default rzp 