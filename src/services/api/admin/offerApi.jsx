import { adminApi } from "./adminApi";


const offerApi = adminApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllCategoryProductNames:builder.query({
            query:()=>({
                url:'admin/offers/categoryProducts',
                method:"GET"
            })
        })
        
    })
})

export const {useGetAllCategoryProductNamesQuery} = offerApi