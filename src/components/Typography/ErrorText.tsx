function ErrorText({styleClass, children}: any){
    return(
        <p className={`text-center  text-error ${styleClass}`}>{children}</p>
    )
}

export default ErrorText