import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v2'
  // withCredentials: true,
  // credentials: 'include'
});

// Add a request interceptor
API.interceptors.request.use((req) => {
  // Add Header Authorization
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    req.headers.authorization = `Bearer ${accessToken}`;
  }

  const language = localStorage.getItem('i18nextLng') ?? 'vi';
  req.headers['accept-language'] = language;

  let uid = localStorage.getItem('uid');
  if (!uid) {
    uid = Date.now();
    localStorage.setItem('uid', uid);
  }
  req.headers.uid = uid;

  return req;
});

// Add a response interceptor
axios.interceptors.response.use(
  // eslint-disable-next-line arrow-body-style
  (res) => {
    // do something with response data
    return res;
  },
  (err) => {
    if (err.response.status === 401 || err.response.status === 403) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  }
);

export const apiInstance = API;

// ----------------------------Auth------------------------------------

// if user exist then login otherwise signup
export const googleOAuth = (googleCredential) => API.post('/auth/google', { googleCredential });

export const register = (data) => API.post('/auth/login', data);
export const login = (username, password) => API.post('/auth/login', { username, password });
export const logout = (refreshToken) => API.post('/auth/logout', { refreshToken });
export const sendEmailOtp = (email) => API.post('/auth/send-otp', { email });
export const checkEmailOtp = (email, otp) => API.post('/auth/check-otp', { email, otp });
export const resetPassword = (account, token, newPassword) =>
  API.post('/auth/reset-password', { account, token, newPassword });

// ----------------------------Account----------------------------------
export const getAccountInfo = () => API.get('/account');
export const updateAccountInfo = (data) => API.patch('/account', data);
export const changePassword = (data) => API.patch('/account/change-password', data);

export const isExistedAccountEmail = (email) => API.get(`/account/is-existed-email/${email}`);
export const isExistedAccountPhone = (phone) => API.get(`/account/is-existed-phone/${phone}`);

export const getAddresses = () => API.get('/account/addresses');
export const addAddress = (data) => API.post('/account/addresses', data);
export const updateAddress = (id, data) => API.patch(`/account/addresses/${id}`, data);
export const deleteAddress = (id) => API.delete(`/account/addresses/${id}`);

// ----------------------------User (staff) --------------------------
export const getAllStaffs = () => API.get('/users/staff');
export const getStaff = (identity) => API.get(`/users/staff/${identity}`);
export const createStaff = (newUser) => API.post('/users/staff', newUser);
export const updateStaff = (identity, updatedUser) => API.patch(`/users/staff/${identity}`, updatedUser);
export const deleteStaff = (identity) => API.delete(`/users/staff/${identity}`);

// ----------------------------User (customer) -----------------------
export const getAllCustomers = () => API.get('/users/customer');
export const getOneUser = (identity) => API.get(`/users/customer/${identity}`);
export const createUser = (newUser) => API.post('/users/customer', newUser);
export const updateUser = (identity, updatedUser) => API.patch(`/users/customer/${identity}`, updatedUser);
export const deleteUser = (identity) => API.delete(`/users/customer/${identity}`);

// ----------------------------Category--------------------------------
export const getAllCategory = (fields) => (fields ? API.get(`/categories?fields=${fields}`) : API.get('/categories'));
export const getOneCategory = (identity) => API.get(`/categories/${identity}`);
export const createCategory = (newCategory) => API.post('/categories', newCategory);
export const updateCategory = (identity, updatedCategory) => API.patch(`/categories/${identity}`, updatedCategory);
export const deleteCategory = (identity) => API.delete(`/categories/${identity}`);

// ----------------------------Brand-----------------------------------
export const getAllBrand = (fields) => (fields ? API.get(`/brands?fields=${fields}`) : API.get('/brands'));
export const getOneBrand = (identity) => API.get(`/brands/${identity}`);
export const createBrand = (newBrand) => API.post('/brands', newBrand);
export const updateBrand = (identity, updatedBrand) => API.patch(`/brands/${identity}`, updatedBrand);
export const deleteBrand = (identity) => API.delete(`/brands/${identity}`);

// ----------------------------Discount--------------------------------
export const getAllDiscount = (params) => API.get('/discounts', { params });
export const getOneDiscount = (identity) => API.get(`/discounts/${identity}`);
export const checkExistedDiscountCode = (code) => API.get(`/discounts/isExistedCode/${code}`);
export const estDiscountAmount = (params) => API.get('/discounts/estAmount', { params });
export const createDiscount = (newDiscount) => API.post('/discounts', newDiscount);
export const updateDiscount = (identity, updatedDiscount) => API.patch(`/discounts/${identity}`, updatedDiscount);
export const deleteDiscount = (identity) => API.delete(`/discounts/${identity}`);

// ----------------------------Product---------------------------------
export const getAllProduct = (fields, search, brand, category, page, limit) =>
  API.get(`/products?fields=${fields}&search=${search}&b=${brand}&c=${category}&page=${page}&limit=${limit}`);
export const getAllProduct2 = (params) => API.get('/products', { params });

export const getSearchSuggest = (keyword) => API.get('/products/search/suggest', { params: { keyword } });
export const getFullAllProduct = () => API.get('/products/all');
export const getRelatedProduct = (listId) =>
  API.post('/products/get-by-ids', { list: listId, fields: '_id name slug category brand views rate variants' });
export const getBestSellerProduct = () => API.get('/products/best-seller');
export const getOneProduct = (identity, fields) => API.get(`/products/${identity}?fields=${fields}`);

export const createProduct = (newProduct) => API.post('/products', newProduct);
export const updateProduct = (identity, updatedProduct) => API.patch(`/products/${identity}`, updatedProduct);
export const toggleHideProduct = (identity) => API.patch(`/products/${identity}/toggleHide`);
export const deleteProduct = (identity) => API.delete(`/products/${identity}`);

// ----------------------------Variant--------------------------------
export const createProductVariant = (identity, newProductVariant) =>
  API.post(`/products/${identity}/variants`, newProductVariant);
export const updateProductVariant = (identity, sku, updatedProduct) =>
  API.patch(`/products/${identity}/variants/${sku}`, updatedProduct);
export const deleteProductVariant = (identity, sku) => API.delete(`/products/${identity}/variants/${sku}`);

// ----------------------------Payment--------------------------------
export const redirectVnPay = (paymentInfo) => API.post(`/payment/vn_pay`, paymentInfo);
export const paymentCallback = () => API.get(`/cart/payment`);

// ----------------------------Order----------------------------------
export const getListOrders = (params = {}) => API.get('/orders', { params });
export const createOrder = (newOrder) => API.post('/orders', newOrder);
export const getOrder = (id) => API.get(`/orders/${id}`);
export const rePayOrder = (id) => API.get(`/orders/re-pay/${id}`);
export const cancelOrder = (id, params) => API.patch(`/orders/cancel/${id}`, { params });

// ----------------------------Order manager---------------------------
export const orderManager = {
  getAll: (search, orderStatus, paymentStatus, page, limit) =>
    API.get(
      `/orders/manager/?search=${search}&status=${orderStatus}&paymentStatus=${paymentStatus}&page=${page}&limit=${limit}`
    ),
  create: (newOrder) => API.post('/orders/manager', newOrder),
  update: (id, updatedOrder) => API.patch(`/orders/manager/${id}`, updatedOrder)
};
// ----------------------------Comment --------------------------------
export const getAllComment = (product) => API.get(`/comments/${product}`);
export const createComment = (newComment) => API.post(`/comments`, newComment);

// ----------------------------Cart------------------------------------
export const getCartItems = (pendingData) => API.post(`/cart`, { items: pendingData });
export const addItemToCart = (item) => API.post(`/cart/add`, item);
export const increaseQty = (item) => API.patch(`/cart`, { ...item, delta: 1 });
export const decreaseQty = (item) => API.patch(`/cart`, { ...item, delta: -1 });
export const removeItemFromCart = (productId, sku) => API.delete(`/cart/${productId}/${sku}`);
export const cleanCart = () => API.delete(`/cart/clean`);

// ----------------------------User behavior----------------------------
export const sendTrackingData = (data) => API.post('/user-behavior', data);
