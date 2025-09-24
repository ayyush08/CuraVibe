## WebContainer Setup Process

### Initial Checks

- Check if webcontainer instance exists
- Verify setup is not already complete or in progress
- Test if files are already mounted by checking for package.json
- If files exist, reconnect to existing server instead of full setup

### Step 1: Transform Template Data

- Transform template data into WebContainer-compatible format
- Convert project structure/files for mounting
- Terminal output: "Transforming template data..."

### Step 2: Mount Files

- Mount the transformed files into the WebContainer filesystem
- Create the project structure within the container
- Terminal output: "Mounting files to WebContainer..."
- Success message: "Files mounted successfully."

### Step 3: Install Dependencies

- Run `npm install` or equivalent within the container
- Stream installation output to terminal in real-time
- Handle potential installation failures(non-zero exit codes
)
- Teminal output: "Installing dependencies..."
- Success message: "Dependencies installed successfully."


### Step 4: Start Development Server

- Execute `npm run start` or equivalent command
- Listen for "server-ready" event from WebContainer
- Stream server startup output to terminal
- Capture server URL and display to user
- Terminal output: "Starting development server..."
- Success message: "Development server is running at [URL]"

### Error Handling
- Catch and log errors at each step
- Display error messages in terminal
- Reset loading state on failure
- Set appropriate error flags to prevent retry loops


### State Management throughout the process

- Track current step(1-4)
- Manage loading states for each phase
- Set completion flags to prevent duplicate runs
- Update preview URL when server is ready


### Reconnection Logic

- If existing sesssion detected, skip full setup
- Reconnect to existing server
- Display reconnection status in terminal
- Maintain same final state as fresh setup