const Coach = require('../models/CoachingProgram');

//grt all program

const getAllprogram = async (req, res, next) => {

  let program;
  try {
    program = await Program.find(); // 👈 populates User details
    } catch (err) {
        console.log(err);
    }

    if (!program || program.length === 0) {
        return res.status(404).json({ message: "No coaches found" });
    }
    //Display all users

    return res.status(200).json({ program });
};

// Get program by ID
const getProgramById = async (req, res ,next) => {
  const id = req.params.id;
      let program;
  
      try {
           program = await Program.findById(id);
      } catch (err) {
          console.log("Error while finding user:", err.message);
          return res.status(500).json({ message: "Something went wrong", error: err.message });
      }
  
      if (!program) {
          return res.status(404).json({ message: "coaches not found" });
      }
  
      return res.status(200).json({ program });

    };

     //data insert
      const addProgram= async (req, res, next) => {
      const { description,fee, duration,coachId, certificateTemplate, materials,timestamps } = req.body;
      let coach;
    
      try {
        program = new Program({
         description,
          fee,
          duration,
          coachId,
          certificateTemplate,
          materials,
          timestamps
        });
    
        await coach.save();
      } catch (err) {
        console.log("Error while saving program:", err.message);
        return res.status(500).json({ message: "Unable to add program", error: err.message });
      }
    
      return res.status(201).json({ program });
    };

    //Update Coach
    
    const updateCoachprogram = async (req, res, next) => {
      const id = req.params.id;
      const { description,fee, duration,coachId, certificateTemplate, materials,timestamps } = req.body;
    
      let coach;
      try {
        coach = await Coach.findByIdAndUpdate(
          id,
          { description,fee, duration,coachId, certificateTemplate, materials,timestamps },
          { new: true, runValidators: true } // return updated doc + validate schema
        );
      } catch (err) {
        console.log("Error while updating program:", err.message);
        return res.status(500).json({ message: "Something went wrong", error: err.message });
      }
    
      if (!coach) {
        return res.status(404).json({ message: "Unable to update - programnot found" });
      }
    
      return res.status(200).json({ message: "program updated successfully", coach });
    };

    //delete Coach
    
    const deleteProgram = async (req, res, next) => {
      const id = req.params.id;
      let coach;
    
      try {
        coach = await Coach.findByIdAndDelete(id);
      } catch (err) {
        console.log("Error while deleting coach:", err.message);
        return res.status(500).json({ message: "Something went wrong", error: err.message });
      }
    
      if (!coach) {
        return res.status(404).json({ message: "Unable to delete - program not found" });
      }
    
      return res.status(200).json({ message: "program deleted successfully", coach });
    };

    // Filter Coaching Programs
const filterPrograms = async (req, res) => {
  try {
    // Read query params from URL
    const { coachId, minFee, maxFee, minDuration, maxDuration, type } = req.query;

    let filter = {};

    if (coachId) {
      filter.coachId = coachId;
    }

    if (minFee || maxFee) {
      filter.fee = {};
      if (minFee) filter.fee.$gte = Number(minFee);
      if (maxFee) filter.fee.$lte = Number(maxFee);
    }

    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = Number(minDuration);
      if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }

    if (type) {
      filter["materials.type"] = type; // filter by material type (video, doc, etc.)
    }

    // Fetch from DB
    const programs = await CoachingProgram.find(filter).populate("coachId", "name email");

    if (!programs || programs.length === 0) {
      return res.status(404).json({ message: "No programs found" });
    }

    res.status(200).json({ programs });
  } catch (err) {
    console.error("Error filtering programs:", err.message);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};



    exports.getAllprogram = getAllprogram;
    exports.getProgramById = getProgramById;
    exports.addProgram = addProgram;
    exports.updateCoachprogram = updateCoachprogram;
    exports.deleteProgram = deleteProgram;
    exports.filterPrograms = filterPrograms;