import React from 'react';
import PrimeReactTable from './ArtworksTable';
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';          // Core CSS
import 'primeicons/primeicons.css';                       // Icons
import 'primeflex/primeflex.css';                         // Flex utilities

function App() {
    return (
        <div className="App">
            <PrimeReactTable />
        </div>
    );
}

export default App;
