const generateForm = document.querySelector(".generate-form");
const generateBtn = document.querySelector(".generate-btn")
const imageGallery = document.querySelector(".image-gallery");
const downloadBtn = document.querySelector(".download-btn");
const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // When the image is loaded Remove the loading class and set Attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
            
        }
    });
}



const generateAiImages = async (userPrompt, userImgQuantity) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: userPrompt,
            n: parseInt(userImgQuantity),
            size: "1024x1024",
            response_format: "b64_json"
        })
    }

    try {
        // Send a request to the AI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", options)

        if (!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json(); //Get data from the response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }
    finally{
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    
    // console.log(e.srcElement);

    // Getting User input and image quantity from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;


    //
    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Creating";
    isImageGenerating = true;

    // Creating HTML markup for image cards with loading state
    const imageCardMarkup = Array.from({ length: userImgQuantity }, () =>
    `<div class="img-card loading">
        <img src="Images/images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="Images/images/download.svg" alt="download">
        </a>
    </div>`
    ).join("");


    imageGallery.innerHTML = imageCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}



generateForm.addEventListener("submit", handleFormSubmission);
