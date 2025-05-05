document.getElementById('bookmarkDropdownBtn').addEventListener('click', () => { // Event listener for the bookmark dropdown button
    const dropdown = document.getElementById('bookmarkDropdown'); // Get the dropdown element
    dropdown.classList.toggle('hidden'); // Toggle the visibility of the dropdown
    const list = document.getElementById('bookmarkList'); // Get the list element inside the dropdown
    list.innerHTML = ''; 
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); // Retrieve bookmarks from local storage
    bookmarks.forEach(word => { // Iterate through each bookmark
      const li = document.createElement('li'); // To create a new list item
      li.className = 'bookmark-item';

      const link = document.createElement('a'); // Create a new anchor element to display the word
      link.href = '#';
      link.textContent = word;
      link.addEventListener('click', (e) => { // Add click event to the link
        e.preventDefault();
        fetchWordData(word);
        dropdown.classList.add('hidden');
      });

      const deleteBtn = document.createElement('button'); // Responsible for deleting the bookmark
      deleteBtn.textContent = '❌'; 
      deleteBtn.addEventListener('click', () => { // Add click event to the delete button
        const updated = bookmarks.filter(w => w !== word);
        localStorage.setItem('bookmarks', JSON.stringify(updated)); // Update local storage
        li.remove(); // Remove the list item from the dropdown
      });

      li.appendChild(link); // Append the link to the list item
      li.appendChild(deleteBtn); // Append the delete button to the list item
      list.appendChild(li); // Append the list item to the dropdown list
    });
  });

  document.getElementById('bookmarkBtn').addEventListener('click', () => { // Event listener for the bookmark button
    const word = document.getElementById('wordInput').value.trim(); // Get the word from the input field
    if (!word) return; // If the input is empty, do nothing
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); // Retrieve bookmarks from local storage
    if (!bookmarks.includes(word)) { // If the word is not already bookmarked add it to the bookmarks
      bookmarks.push(word);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      alert(`"${word}" bookmarked!`);
    } else { // If the word is already bookmarked, show an alert
      alert(`"${word}" is already bookmarked.`);
    }
  });