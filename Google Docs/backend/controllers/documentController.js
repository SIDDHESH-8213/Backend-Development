const Document = require('../models/Document');
const io = require('../server');

exports.createDocument = async(req, res) =>{
    try{
        const {title, content} = req.body;
        const document = new Document({title, content, owner: req.user.id});
        await document.save();
        res.status(201).json(document);
    } catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.getDocuments = async (req, res) =>{
    try{
        const documents = await Document.find({owner: req.user.id})
        res.json(documents);
    } catch(error){
        res.status(401).json({error: error.message});
    }
};

exports.getDocumentById = async (req, res)=>{
    try{
        const document = await Document.findById(req.params.id);
        if(!document){
            return res.status(400).json({message: `Document not found`});
        }
        res.json(document);
    } catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.updateDocument = async (req, res)=>{
    try{
        const {title, content} = req.body;
        const document = await Document.findByIdAndUpdate(
            req.params.id, 
            {title, content, updatedAt: Date.now()},
            {new: true}
        );
        if(!document){
            return res.status(404).json({message: `Docuemnt not found`});
        }

        //io.to(req.params.id).emit('receiveddocumentchange', content);

        res.json(document);
    } catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.deleteDocument = async (req, res)=>{
    try{
        const document = await Document.findByIdAndDelete(
            req.params.id
        )

        if(!document){
            return res.status(404).json({message: `Document not found`});
        }
        res.json({message: 'Document deleted successfully'});
    } catch(error){
        res.status(400).json({error: error.message});
    }
};