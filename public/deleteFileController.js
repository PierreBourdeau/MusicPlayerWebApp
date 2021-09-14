async function deleteData(data) {
    console.log('Delete file function')
    const result = await fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({title: data}),
    });
    if (result.ok) {
        console.log('Fetch success');
        const resp = await result.text();
        
    }
};
