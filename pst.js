document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const postModal = document.getElementById('postModal');
    const openPostModalBtn = document.getElementById('openPostModal');
    const closePostModalBtn = postModal.querySelector('.close-btn');
    const postTextarea = document.getElementById('postText');
    const mediaFileInput = document.getElementById('mediaFile'); // NEW: File input
    const fileNameDisplay = document.getElementById('fileNameDisplay'); // NEW: File name display
    const postSubmitBtn = document.getElementById('postSubmitBtn');
    const postFeed = document.getElementById('postFeed');
    
    const reactorsModal = document.getElementById('reactorsModal');
    const closeReactorsBtn = reactorsModal.querySelector('.close-reactors-btn');
    const reactorsList = document.getElementById('reactorsList');

    let postIdCounter = 0; 
    const postData = {}; // Stores reactions and comments by postId

    // --- Modal Control Functions ---
    openPostModalBtn.onclick = () => { postModal.style.display = 'block'; }
    closePostModalBtn.onclick = () => { postModal.style.display = 'none'; }
    closeReactorsBtn.onclick = () => { reactorsModal.style.display = 'none'; }

    // Close modals when clicking outside
    window.onclick = (event) => {
        if (event.target == postModal) {
            postModal.style.display = 'none';
        }
        if (event.target == reactorsModal) {
             reactorsModal.style.display = 'none';
        }
    }

    // --- NEW: Handle file selection and display filename ---
    mediaFileInput.addEventListener('change', () => {
        if (mediaFileInput.files.length > 0) {
            fileNameDisplay.textContent = `File selected: ${mediaFileInput.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // --- 1. Dynamic Post Creation Function (UPDATED) ---
    postSubmitBtn.onclick = () => {
        const textContent = postTextarea.value.trim();
        const file = mediaFileInput.files[0];
        
        if (textContent === '' && !file) {
            alert("Please enter some text or select a file to post.");
            return;
        }

        // Use FileReader to read the file and create the post only when the file is ready
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // e.target.result holds the Data URL of the file
                const mediaSource = e.target.result; 
                createPostElement(textContent, mediaSource, file.type);
                
                // Reset and close the modal
                resetAndCloseModal();
            };

            // Read the file as a Data URL
            reader.readAsDataURL(file); 
        } else {
            // No file selected, just post text
            createPostElement(textContent, null, null);
            resetAndCloseModal();
        }
    };
    
    function resetAndCloseModal() {
        postTextarea.value = '';
        mediaFileInput.value = ''; // Clear file input
        fileNameDisplay.textContent = ''; // Clear file name display
        postModal.style.display = 'none';
    }


    // --- Post Creation and Media Rendering ---
    function createPostElement(textContent, mediaSource, mediaType) {
        postIdCounter++;
        const postId = `post-${postIdCounter}`;

        const newPost = document.createElement('div');
        newPost.className = 'user-post';
        newPost.id = postId;
        
        newPost.innerHTML = `
            <div class="post-header">User ${postIdCounter} just posted:</div>
            
            <div class="post-body">
                ${textContent ? `<p>${textContent.replace(/\n/g, '<br>')}</p>` : ''}
                ${createMediaElement(mediaSource, mediaType)}
            </div>

            <div class="reaction-bar">
                <button class="reaction-btn" data-reaction="like" data-post-id="${postId}"><i class="far fa-thumbs-up"></i> Like</button>
                <button class="reaction-btn" data-reaction="love" data-post-id="${postId}"><i class="fas fa-heart"></i> Love</button>
                <button class="reaction-btn" data-reaction="dislike" data-post-id="${postId}"><i class="far fa-thumbs-down"></i> Dislike</button>
            </div>

            <div class="post-info">
                <span class="reaction-summary" data-post-id="${postId}">0 Reactions</span>
                <button class="link-btn view-reactors" data-post-id="${postId}">View Reactors</button>
                <span class="comment-summary" data-post-id="${postId}"> | 0 Comments</span>
            </div>

            <div class="comment-section">
                <h4>Comments:</h4>
                <div class="comments-container"></div>
                <div class="comment-input-area">
                    <textarea placeholder="Write a comment..." rows="1" data-post-id="${postId}"></textarea>
                    <button class="comment-submit-btn" data-post-id="${postId}">Submit</button>
                </div>
            </div>
        `;
        
        postFeed.prepend(newPost);
    }

    // Helper to create media HTML (using mediaType to determine element)
    function createMediaElement(source, type) {
        if (!source) return '';
        
        if (type.startsWith('image/')) {
            return `<img src="${source}" alt="User content image">`;
        } else if (type.startsWith('video/')) {
            // Controls, loop, and muted are good practice for autoplaying video/GIFs
            return `<video src="${source}" controls loop muted autoplay></video>`;
        } else {
            // Fallback for unknown type
            return `<p>Cannot display media: ${type}</p>`;
        }
    }


    // --- 2. Event Delegation for Reactions, Comments, and Reactor Viewer ---
    // (This section remains identical to the previous version to handle clicks on the dynamically created posts)
    postFeed.addEventListener('click', (event) => {
        if (event.target.closest('.reaction-btn')) {
            const button = event.target.closest('.reaction-btn');
            const postId = button.getAttribute('data-post-id');
            const reactionType = button.getAttribute('data-reaction');
            handleReaction(postId, reactionType, button);
        }

        if (event.target.classList.contains('comment-submit-btn')) {
            const postId = event.target.getAttribute('data-post-id');
            const textarea = document.querySelector(`.comment-input-area textarea[data-post-id="${postId}"]`);
            handleCommentSubmission(postId, textarea);
        }

        if (event.target.classList.contains('view-reactors')) {
            const postId = event.target.getAttribute('data-post-id');
            showReactorsModal(postId);
        }
    });

    // --- 3. Reaction and Comment Handling Functions (Identical to previous script) ---
    function handleReaction(postId, reactionType, button) {
        if (!postData[postId]) { postData[postId] = { reactions: {}, comments: [] }; }
        
        const reactions = postData[postId].reactions;
        const currentUser = 'You'; 

        let previousReaction = Object.keys(reactions).find(type => reactions[type].includes(currentUser));

        const postElement = document.getElementById(postId);
        postElement.querySelectorAll('.reaction-btn').forEach(btn => btn.classList.remove('active'));

        if (previousReaction) {
            reactions[previousReaction] = reactions[previousReaction].filter(user => user !== currentUser);
        }

        if (previousReaction !== reactionType) {
            if (!reactions[reactionType]) reactions[reactionType] = [];
            reactions[reactionType].push(currentUser);
            button.classList.add('active');
        } 

        updateReactionSummary(postId);
    }

    function updateReactionSummary(postId) {
        const reactions = postData[postId].reactions || {};
        const summaryElement = document.querySelector(`.reaction-summary[data-post-id="${postId}"]`);
        
        let totalCount = 0;
        let summaryText = '';
        
        const counts = { like: 0, love: 0, dislike: 0 };
        for (const type in reactions) {
            counts[type] = reactions[type].length;
            totalCount += reactions[type].length;
        }

        if (totalCount === 0) {
            summaryText = '0 Reactions';
        } else if (totalCount === 1) {
            if (counts.like === 1) summaryText = '1 Like';
            else if (counts.love === 1) summaryText = '1 Love';
            else if (counts.dislike === 1) summaryText = '1 Dislike';
        } else {
            const parts = [];
            if (counts.like > 0) parts.push(`${counts.like} Likes`);
            if (counts.love > 0) parts.push(`${counts.love} Loves`);
            if (counts.dislike > 0) parts.push(`${counts.dislike} Dislikes`);
            
            summaryText = parts.join(', ');
        }
        
        summaryElement.textContent = summaryText;
    }


    function handleCommentSubmission(postId, textarea) {
        const commentText = textarea.value.trim();
        if (commentText === '') return;

        if (!postData[postId]) { postData[postId] = { reactions: {}, comments: [] }; }

        const comment = { user: 'You', text: commentText };
        postData[postId].comments.push(comment);
        
        const commentsContainer = document.querySelector(`#${postId} .comments-container`);
        const newCommentDiv = document.createElement('div');
        newCommentDiv.className = 'comment';
        newCommentDiv.innerHTML = `<strong>${comment.user}:</strong> ${comment.text}`;
        commentsContainer.appendChild(newCommentDiv);
        
        const commentSummary = document.querySelector(`.comment-summary[data-post-id="${postId}"]`);
        commentSummary.textContent = ` | ${postData[postId].comments.length} Comments`;

        textarea.value = ''; 
    }


    function showReactorsModal(postId) {
        reactorsList.innerHTML = ''; 
        const reactions = postData[postId]?.reactions;
        
        if (!reactions || Object.keys(reactions).every(key => reactions[key].length === 0)) {
            reactorsList.innerHTML = '<li>No one has reacted yet.</li>';
        } else {
            for (const type in reactions) {
                reactions[type].forEach(user => {
                    const listItem = document.createElement('li');
                    const displayType = type.charAt(0).toUpperCase() + type.slice(1);
                    listItem.textContent = `${user} (${displayType}d)`; 
                    reactorsList.appendChild(listItem);
                });
            }
        }

        reactorsModal.style.display = 'block';
    }
});