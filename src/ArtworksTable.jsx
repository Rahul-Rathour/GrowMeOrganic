import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

const PrimeReactTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [autoSelectCount, setAutoSelectCount] = useState(0);
    const overlayPanelRef = useRef(null);

    // Fetch data from the API
    const fetchData = async (pageNumber) => {
        setLoading(true);
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`);
        const result = await response.json();
        setData(result.data);
        setTotalRecords(result.pagination.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const onPageChange = (event) => {
        setPage(event.page + 1);
    };

    const onRowSelectionChange = (event) => {
        setSelectedRows(event.value);
    };

    const autoSelectRows = async (count) => {
        let selected = [...selectedRows];
        let remaining = count;
        let currentPage = 1;

        while (remaining > 0) {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPage}`);
            const result = await response.json();
            const rows = result.data.slice(0, remaining);
            selected = [...selected, ...rows];
            remaining -= rows.length;
            currentPage += 1;
        }

        setSelectedRows(selected);
    };

    const dropdownTemplate = () => (
        <div>
            <Button
            style={{color:'black'}}
                icon="pi pi-caret-down"
                className="p-button-rounded p-button-secondary p-mr-2"
                onClick={(e) => overlayPanelRef.current.toggle(e)}
                aria-haspopup
                aria-controls="overlay_panel"
            />
            <OverlayPanel ref={overlayPanelRef}>
                <div className="p-3">
                    <h5>Custom Selection</h5>
                    <InputNumber
                        value={autoSelectCount}
                        onValueChange={(e) => setAutoSelectCount(e.value)}
                        placeholder="Enter rows count"
                        className="p-mb-2"
                    />
                    <Button
                    style={{color:'black'}}
                        label="Select"
                        onClick={() => {
                            autoSelectRows(autoSelectCount);
                            overlayPanelRef.current.hide();
                        }}
                    />
                </div>
            </OverlayPanel>
        </div>
    );

    return (
        <div className="p-m-4">
            <h2>Artworks Table</h2>
            {loading ? (
                <ProgressSpinner />
            ) : (
                <DataTable
                    value={data}
                    paginator
                    rows={10}
                    totalRecords={totalRecords}
                    lazy
                    onPage={onPageChange}
                    selection={selectedRows}
                    onSelectionChange={onRowSelectionChange}
                    
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                    <Column header={dropdownTemplate} bodyStyle={{ textAlign: 'center' }} headerStyle={{ width: '3em' }} />
                    <Column field="title" header="Title" />
                    <Column field="place_of_origin" header="Place of Origin" />
                    <Column field="artist_display" header="Artist" />
                    <Column field="inscriptions" header="Inscriptions" />
                    <Column field="date_start" header="Date Start" />
                    <Column field="date_end" header="Date End" />
                </DataTable>
            )}

            {selectedRows.length > 0 && (
                <div className="p-mt-4">
                    <h3>Selected Rows:</h3>
                    <ul>
                        {selectedRows.map((row, index) => (
                            <li key={index}>{row.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PrimeReactTable;
