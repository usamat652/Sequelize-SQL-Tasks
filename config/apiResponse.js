function SuccessApi(res, productData) {
    res.json({
        status: "Success",
        data: productData,
        message: 'Data Fetched Successfully'
    });
}
function FailedApi(res, message) {
    res.json({
        status: message,
        productData: [],
        message: 'Internal Server Error'

    });
}

export {
    SuccessApi,
    FailedApi
}
