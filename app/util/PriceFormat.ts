const formatPrice = (amount:number)=>{
     return new Intl.NumberFormat('en-Us',{
         style:'currency',
         currency:'USD'
     }).format(amount/100)
}

export default formatPrice