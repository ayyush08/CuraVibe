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




----------------------------------------------------

# useAISuggestion Hook
- for managing AI-powered code suggestions inside a code editor (like Monaco)

## Step by Step breakdown

### Step 1 : State Setup

The hook keeps track of:

- `suggestion`: The AI's suggested code text
- `isLoading`: whether we are waiting for AI response
- `position`: where in the editor the suggestion should go (line/column)
- `decoration` - special visual marker in the editor for suggestion (like underline or highlight)
- `isEnabled`: whether AI suggestions are turned on or off


### Step 2 : Turning AI Suggestions On/Off

- `toggleEnabled` - simply flips the `isEnabled` state
- If disabled, no AI suggestions will be fetched

### Step 3 : Fetching an AI Suggestion

- `fetchSuggestion(type,editor)` does the heavy lifting.
- **Steps it follows:**
  1. Checks if AI suggestions are enabled
  2. Checks if the editor is available
  3. Gets:
        - The entire code in the editor
        - The current cursor position
  4. Sends thiss data to `api/code-suggestion` 
  5. Waits for the AI to respond
  6. If AI sends a suggestion, store it in a state along with the cursor position
  7. If something fails, logs the error and stops loading


### Step 4 : Accepting the Suggestion

- `acceptSuggestion(editor,monaco)` - inserts the AI suggestion directly into the code at the saved position.
- It also removes any highlight/decoration related to the suggestion.
- After insertion, it clears the suggestion from memory.

### Step 5 :  Rejecting or Clearing a Suggestion
- `rejectSuggestion(editor)` - removes suggestions and highlights without inserting anything.

- `clearSuggestion(editor)` - same  as reject, but can be used in other cases (like after saving)


### Step 6 : Return Value
The hook returns:
- The current AI suggestion state(all variables like suggestion text, loading state,etc)
- Functions to toggle, fetch, accept, reject, and clear suggestions

### ✅In Short
This hook talks to an AI API, gets code suggestions, show them to user, and lets them accept or reject them - just like GitHub Copilot but inside your own editor


----------------------------------------------------------

# What happens in `api/code-suggestion` endpoint?

## 1. Gets api request from the editor
 - The frontend sends the entire file's code, the cursor position, and the type of suggestion needed 

## 2. Checks if request is valid
 - Makes sure all important information is present

## 3. Understands the surrounding code
- Looks at 10lines before and after the cursor to get context
- Finds out the language and framework being used
- Checks if you are inside a function, class, or component
- Detects if you are typing after a comment
- Looks for half-written code patterns (like unfinished loops or conditionals or method calls)

## 4. Builds a clear instruction for the AI
- Descriibe the code context
- Tells the AI exactly what kinds of code to suggest
- Includes rules like "keep proper indentation" and "follow best practices"

## 5. Talks to the AI model
- Sends the prepared instruction to an AI
- Waits for the AI to return a suggestion


## 6. Cleans up the AI's answer
- Removes extra formatting or markers
- Keeps only the code that should be inserted

## 7. Sends the suggestion back to the frontend
- Includes suggestion,details about the code context, and some metadata(like language/framework,time).


----------------------------------------------------------

# Steps to ADD AI Inline Suggestions in Monaco Editor

## 1. Track References

You'll need some extra `ref`s to manage the inline suggestion lifecycle:
- `inlineCompletionProviderRef` - Stores the registered completion provider instance so it can be disposed of later.
- `currentSuggestionRef` - Stores the active suggestion text,position, and ID
- `isAcceptingSuggestionRef` & `suggestionAcceptedRef` - Flags to prevent duplicate acceptance
- `tabCommandRef` - Stores a custom Tab key handler.
- `suggestionTimeoutRef` - Used to delay triggering suggestions 

## 2. Create the Inline Completion Provider
This tells Monaco how to provide inline suggestions when the editor requests them.

```typescript
const createInlineCompletionProvider = useCallback((monaco: Monaco) => {
  return {
    provideInlineCompletions: async(model,position)=>{
      if(!suggestion || !suggestionPosition) return {
        items:[]
      }

      //Match position before showing
      const isPositionMatch = 
      position.lineNumber === suggestionPosition.line &&
      position.column >= suggestionPosition.column &&
      position.column <= suggestionPosition.column + 2;

      if(!isPositionMatch) return {items:[]};

      const cleanSuggestion = suggestion.replace(/\\r/g,"");


      return {
        items:[
          {
            insertText: cleanSuggestion,
            range: new monaco.Range(
              suggestionPosition.line,
              suggestionPosition.column,
              suggestionPosition.line,
              suggestionPosition.column 
            ),
            kind: monaco.languages.InlineCompletionItemKind.Text,
            label: 'AI Suggestion',
            insertTextRules: monaco.languages.InlineCompletionInsertTextRule.InsertAsSnippet,
          }
        ]
      }
    }
    freeInlineCompletions: ()=>{}
  };
},[suggestion,suggestionPosition]);
```


## 3. Register the Provider When you have a Suggestion
 When you get a suggestion from AI:

 ```typescript
 if(inlineCompletionProviderRef.current){
   inlineCompletionProviderRef.current.dispose();
 }
 const language = getEditorLanguage(activeFile?.fileExtension || '');

 inlineCompletionProviderRef.current = monaco.languages.registerInlineCompletionsProvider(
  language,
  createInlineCompletionProvider(monacoRef.current!)
  )
  //Trigger suggestion display

  editorRef.current!.trigger('ai',"editor.action.inlineSuggest.trigger",null)

```

## 4. Accept Suggestion on `Tab` Key Press

Override Monaco's Tab key behavior to insert AI suggestions:

```typescript
tabCommandRef.current = editor.addCommand(monaco.KeyCode.Tab,()=>{
  if(currentSuggestionRef.current){
    //Insert suggestion manually
     

    editor.setPosition({
      lineNumber: suggestionPosition.line,
      column: suggestionPosition.column + suggestion.length
    })
    

    //Clear suggestion after accepting
    currentSuggestionRef.current = null;
    }
    else{
      editor.trigger('keyboard','tab',null) //Default Tab behavior
    }
})
```

## 5. Reject Suggestion on `Esc` Key Press

If user presses `Esc`, remove the suggestion:

```typescript
editor.addCommand(monaco.KeyCode.Escape,()=>{
  currentSuggestionRef.current = null;
  editor.trigger('ai','editor.action.inlineSuggest.hide',null)
})
```


## 6. Trigger Suggestions Automaticallly
You can trigger suggestion after certain typing events:
```typescript
editor.onDidChangeModelContent((e)=>{
  const lastChar = e.changes[0]?.text

  if(["\n",".","(","{","m"," "].includes(lastChar)){
    setTimeout(()=>{
      editor.trigger('ai','editor.action.inlineSuggest.trigger',null)
    },100)
  }
})
```

## 7. Cleanup on Unmount
Dispose of provider and event listeners:
```typescript
useEffect(()=>{
  return ()=>{
    inlineCompletionProviderRef.current?.dispose();
    tabCommandRef.current?.dispose();
},[])
```

## Summary
1. Get AI suggestions from backend - store text & positon.
2. Register `InlineCompletionsProvider` .
3. Trigger `editor.action.inlineSuggest.trigger` .
4. User presses `Tab` - insert suggestion manually.
5. `Esc` - reject suggestion.
6. Auto-trigger after certain characters or idle time.
7. Clean up providers/listeners