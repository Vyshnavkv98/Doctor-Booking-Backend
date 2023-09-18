class badRequestError extends Error {

    code: number;
    
    constructor(args: any) {
        super(args);

        this.code = 400;
    }
}

export default badRequestError;