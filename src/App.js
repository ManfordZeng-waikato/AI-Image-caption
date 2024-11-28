import React from 'react';
import ImageUpload from './components/ImageUpload';
import logo from './assets/veridian.PNG'; // Import the image

function App() {
    return (
        <div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <img src={logo} alt="Veridian Logo" style={{ width: '300px', marginBottom: '10px' }} />
                
            </div>
            <ImageUpload />
        </div>
    );
}

export default App;
