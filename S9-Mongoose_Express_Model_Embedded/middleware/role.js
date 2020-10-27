function authorizeByRoleType(roleList = []){
    if (typeof roleList === 'string') {
        roleList = [roleList];
    };
    
    return[
        (req,res,next) => {            
            if(!roleList.includes(req.user.role)) return res.status(403).send('No tens el rol permés per accedir a aquest recurs!');
            next();
        }
    ];
};

module.exports = authorizeByRoleType;