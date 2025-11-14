# MongoDB Duplicate Index Warning

This warning appears because the Student schema might have duplicate index definitions.

## Solution (Optional):
The warning is harmless and doesn't affect functionality. 

If you want to remove it, check your Student model schema and ensure:
1. Email field doesn't have both `unique: true` and `index: true`
2. Use only `unique: true` for email field

Example:

The backend will work perfectly with this warning.