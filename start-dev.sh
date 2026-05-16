#!/bin/bash

# EXPENDABLES - Development Start Script
# This script starts both backend and frontend in separate terminal windows

echo "🚀 Starting EXPENDABLES Development Environment"
echo ""

# Check if we're on Mac (for osascript)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Starting Backend in new terminal..."
    osascript <<EOF
        tell application "Terminal"
            do script "cd $(pwd)/backend && echo '🔧 BACKEND SERVER' && npm run dev"
            activate
        end tell
EOF
    
    sleep 2
    
    echo "Starting Frontend in new terminal..."
    osascript <<EOF
        tell application "Terminal"
            do script "cd $(pwd)/frontend && echo '🎨 FRONTEND SERVER' && npm run dev"
            activate
        end tell
EOF
    
    echo ""
    echo "✅ Development servers starting in separate terminals!"
    echo ""
    echo "Backend: http://localhost:5030"
    echo "Frontend: http://localhost:3000"
    echo "Admin: http://localhost:3000/admin"
else
    # For Linux/WSL - use gnome-terminal or xterm
    echo "Starting Backend..."
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd $(pwd)/backend && echo '🔧 BACKEND SERVER' && npm run dev; exec bash"
        sleep 2
        echo "Starting Frontend..."
        gnome-terminal -- bash -c "cd $(pwd)/frontend && echo '🎨 FRONTEND SERVER' && npm run dev; exec bash"
    else
        # Fallback to background processes
        echo "Running in background mode (Linux/WSL)..."
        cd backend && npm run dev &
        BACKEND_PID=$!
        cd ../frontend && npm run dev &
        FRONTEND_PID=$!
        
        echo ""
        echo "✅ Servers started in background!"
        echo "Backend PID: $BACKEND_PID"
        echo "Frontend PID: $FRONTEND_PID"
        echo ""
        echo "To stop servers:"
        echo "  kill $BACKEND_PID $FRONTEND_PID"
    fi
fi

echo ""
echo "📝 Login credentials:"
echo "  Admin: admin@expendables.com / Admin@123"
echo "  Customer: customer@test.com / Customer@123"
echo ""
