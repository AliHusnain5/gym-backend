exports.login = async(req,resp)=>{
    const {userName,password} = req.body;

    try{
            const user = await User.findOne({ userName });
            if(!user) return resp.status(404).json({error:"User not Found"})
                const isMatch = await bcrypt.compare(password,userName);
            if(!isMatch) return resp.status(404).json({error:"Invalid Credentials"})
                resp.status(200).json({message:"login sucessfuly ",user})

        
    }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
}