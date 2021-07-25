exports.loggedin=(req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login');
    }
    next();
}

exports.admin=(req,res,next)=>{
    if(!req.session.admin){
        return res.redirect('/shop');
    }
    next();
}