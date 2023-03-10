//o controller das caterogiras se refere às rotas delas 
const express = require("express")
const router = express.Router() //permite trabalharmos com rotas fora do index.js
//importo model do category para salvar no database
const Category = require("./Category") 
//importa slugify para transformar título em algo otimizado para url
//ex: Computação e informática -> computacao-e-informatica
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")//middleware de auth rota privada



router.get("/admin/categories/new", adminAuth, (req,res)=>{
    res.render("admin/categories/new")
})

router.post("/categories/save", (req,res)=>{
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new")
    }
})

router.get("/admin/categories", adminAuth, (req,res)=>{

    Category.findAll().then((categories)=>{
        res.render("admin/categories/index", {categories:categories})
    })

})

router.post("/categories/delete", (req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
        }else{//NÃO FOR NÚMERO
            res.redirect("/admin/categories")
        }
    }else{ //UNDEFINED
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", adminAuth, (req,res)=>{
    
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories")
    }
    //usado para pesquisar categoria pelo ID
    Category.findByPk(id).then((category)=>{
        if(category != undefined){
            res.render("admin/categories/edit",{category: category})
        }else{
            res.redirect("/admin/categories")   
        }
    }).catch((erro)=>{
        res.redirect("/admin/categories")
        
    })
})

router.post("/categories/update", (req,res)=>{
    var id = req.body.id
    var title = req.body.title

    Category.update({title:title, slug: slugify(title)},
        {where:{
            id:id
        }}
    ).then(()=>{
        res.redirect("/admin/categories")
    })
})

module.exports = router