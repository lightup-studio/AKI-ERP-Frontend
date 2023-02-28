function HelperText({className, children}: any){
    return(
        <div className={`text-slate-400 ${className}`}>{children}</div>
    )
}

export default HelperText