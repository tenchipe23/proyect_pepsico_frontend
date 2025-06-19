#!/bin/bash

# Development startup script for PepsiCo Vehicle Exit Pass System

echo "🚀 Starting PepsiCo Vehicle Exit Pass System Development Environment"

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "📦 Starting PostgreSQL..."
    brew services start postgresql
    sleep 3
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw pepsico_vehicle_pass; then
    echo "🗄️  Creating database..."
    createdb pepsico_vehicle_pass
    psql -d postgres -c "CREATE USER pepsico_user WITH PASSWORD 'pepsico123';"
    psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE pepsico_vehicle_pass TO pepsico_user;"
fi

# Start backend in background
echo "🔧 Starting Spring Boot Backend..."
cd backend
mvn spring-boot:run -Dspring.profiles.active=local > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Check if backend is running
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "❌ Backend failed to start. Check logs/backend.log"
    exit 1
fi

# Start frontend
echo "🎨 Starting Next.js Frontend..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend failed to start. Check logs/frontend.log"
fi

echo ""
echo "🎉 Development environment is ready!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "📊 Backend Health: http://localhost:8080/actuator/health"
echo ""
echo "📝 Test Credentials:"
echo "   Admin: admin@pepsico.com / password123"
echo "   Autorizador: autorizador@pepsico.com / password123"
echo "   Seguridad: seguridad@pepsico.com / password123"
echo ""
echo "🛑 To stop the services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"

# Save PIDs for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# Keep script running
wait
