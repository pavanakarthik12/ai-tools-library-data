# How to Test the Tags Functionality

## Step 1: Fix Environment Variables

The error you're seeing is because your Supabase credentials are not properly set up. You need to create a `.env.local` file:

### Create `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://peqwvucdgpazpylwqurq.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Replace `your_actual_anon_key_here` with your real Supabase anon key from your Supabase dashboard.**

## Step 2: Start the Development Server

```bash
npm run dev
```

## Step 3: Test the Tags Functionality

### Option A: Test via Browser (Recommended)

1. **Open your browser** and go to: `http://localhost:5173/tags-test`
2. **Open Developer Tools** (Press F12)
3. **Go to Console tab**
4. **Look for the test results**

### Option B: Test the Main App

1. **Go to**: `http://localhost:5173/library`
2. **Check if tools load** (if you have data in your Supabase table)
3. **Open Console** to see any fetch errors

## Step 4: What to Look For

### ✅ Success Indicators:
```
🔍 Testing tags fetch from Supabase...
✅ Tags fetched successfully!
📊 Total tools fetched: 5

📋 Tool 1:
  Name: ChatGPT
  Tags: ["AI", "Assistant", "Chat"]
  Tags type: object
  Is array: true
  Tags length: 3
```

### ❌ Error Indicators:
- `❌ Supabase error:` - Connection/authentication issues
- `⚠️ No tools found` - Empty database
- `Tags: null` - Tags not properly formatted
- `Is array: false` - Tags stored as strings instead of arrays

## Step 5: Fix Common Issues

### If you see "No tools found":
1. **Check your Supabase table** has data
2. **Run the SQL migration** from `fix-tags-sql.sql`
3. **Verify table name** is exactly `tools`

### If you see connection errors:
1. **Check your `.env.local` file** exists and has correct values
2. **Restart the dev server** after creating `.env.local`
3. **Verify your Supabase URL and key** are correct

### If tags are strings instead of arrays:
1. **Run the SQL migration** in `fix-tags-sql.sql`
2. **Check your database** has `tags` as `text[]` column type

## Step 6: Test the Full App

Once the test page works:

1. **Go to**: `http://localhost:5173/library`
2. **Try adding a new tool** with tags like: `AI, Productivity, Free`
3. **Check if tags display** as individual tags in the UI
4. **Verify tags are stored** as arrays in Supabase

## Step 7: Clean Up (Optional)

After testing, you can remove the test component:

1. **Remove from App.jsx**:
   - Delete: `import TagsTest from './components/TagsTest';`
   - Delete: `<Route path="/tags-test" element={<TagsTest />} />`

2. **Delete the test file**: `src/components/TagsTest.jsx`

## Quick Test Checklist

- [ ] `.env.local` file created with correct Supabase credentials
- [ ] Dev server running without errors
- [ ] `/tags-test` page loads and shows console output
- [ ] Tags are displayed as arrays in console
- [ ] Main app at `/library` loads tools correctly
- [ ] Can add new tools with tags
- [ ] Tags display properly in the UI

## Troubleshooting

**If the dev server won't start:**
- Check your `.env.local` file has the correct format
- Make sure you're in the right directory (`ai-tools-library`)
- Try deleting `node_modules` and running `npm install` again

**If you see "No tools found":**
- Check your Supabase table has data
- Verify the table name is exactly `tools`
- Check your Supabase URL and key are correct
