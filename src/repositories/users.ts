import prisma from "@/src/lib/prisma";

export const getUserIdFromWallet=async(wallet:string)=>{
  const user =  await prisma.user.findUnique({
    where:{
      wallet
    }
  })
  return user?.id
}