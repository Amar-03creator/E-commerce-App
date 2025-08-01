//registerFormControls
//loginFormControls
//addProductFormElements

export const registerFormControls = [
  {
    name: "userName",
    label: "User name",
    placeholder: "Enter your name here",
    componentType: "input",
    type: "text",

  }, {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",

  }, {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",

  }
]

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",

  }, {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",

  }
]


export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id:'home',
    label: 'Home',
    path: '/shop/home',
  },
  {
    id:'products',
    label: 'Products',
    path: '/shop/listing',
  },
  {
    id:'men',
    label: 'Men',
    path: '/shop/listing',
  },
  {
    id:'women',
    label: 'Women',
    path: '/shop/listing',
  },
  {
    id:'kids',
    label: 'Kids',
    path: '/shop/listing',
  },
  {
    id:'footwear',
    label: 'Footwear',
    path: '/shop/listing',
  },
  {
    id:'accessories',
    label: 'Accessories',
    path: '/shop/listing',
  },
  {
    id:'search',
    label: 'Search',
    path: '/shop/search',
  }
];

export const categoryOptionsMap = {
  'men':'Men',
  'women':'Women',
  'kids':'Kids',
  'accessories':'Accessories',
  'footwear':'Footwear',

}

export const brandOptionsMap = {
  'nike':'Nike',
  'adidas':'Adidas',
  'puma':'Puma',
  'levi':'Levi\'s',
  'zara':'Zara',
  'h&m':'H&M',
}

export const filterOptions = {
  category:[
    { id: "men", label: "Men" },  
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },],
  brand:[
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },],
}

export const sortOptions = [
  { id: "priceLowToHigh", label: "Price: Low to High" },
  { id: "priceHighToLow", label: "Price: High to Low" },
  { id: "newestArrivals", label: "Newest Arrivals" },
  { id: "bestSellers", label: "Best Sellers" },
  { id: "mostPopular", label: "Most Popular" },
];


export const addressFormControls = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter your Name",
    componentType: "input",
    type: "text",
  },
  {
    name: "street",
    label: "Street Address",
    placeholder: "1234 Main St",
    componentType: "input",
    type: "text",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter your city",
    componentType: "input",
    type: "text",
  },
  {
    name: "state",
    label: "State / Province / Region",
    placeholder: "Enter your state/province/region",
    componentType: "input",
    type: "text",
  },
  {
    name: "zip",
    label: "Postal Code / ZIP Code",
    placeholder: "Enter your postal code or ZIP code",
    componentType: "input",
    type: "tel",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
  },
  {
    name: "notes",
    label: "Additional Notes",
    placeholder: "Enter any notes (e.g. “Leave package at back door”)",
    componentType: "textarea",
    rows: 3, // you can use this when rendering a <textarea>
  },
];
