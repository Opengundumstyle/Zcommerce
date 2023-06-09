type Params ={
     id:string,
}

type SearchParams ={
    itemId: string
    name: string
    image: string
    unit_amount:number | null
    id:string
    description:string | null
    details:string
}


export type SearchParamTypes = {
    params:Params
    searchParams:SearchParams
}