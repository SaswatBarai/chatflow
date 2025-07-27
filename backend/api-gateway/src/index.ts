import express,{Request,Response,NextFunction} from 'express';
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  CHAT: process.env.CHAT_SERVICE_URL || 'http://localhost:3002',
  MEDIA: process.env.MEDIA_SERVICE_URL || 'http://localhost:3003',
  WEBSOCKET: process.env.WEBSOCKET_SERVICE_URL || 'http://localhost:3004'
};

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: SERVICES
  });
});

// Logging middleware - logs all requests
app.use((req, res, next) => {
    console.log("hello")
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


//All Services

app.use("/api/auth", createProxyMiddleware({
    target: SERVICES.AUTH,
    changeOrigin: true,// for virtual hosted sites
    pathRewrite:{
        "^/api/auth":"" // remove base path
    },
    onError:(err: any, req: Request, res: Response) => {
        console.error("Auth Service Error:", err.message);;
        res.status(500).json({ error: 'Auth Service is unavailable' });
    }
}))


app.use("/api/chat", createProxyMiddleware({
    target: SERVICES.CHAT,
    changeOrigin: true,
    pathRewrite:{
        "^/api/chat":"" // remove base path
    },
    onError:(err: any, req: Request, res: Response) => {
        console.error("Chat Service Error:", err.message);
        res.status(500).json({ error: 'Chat Service is unavailable' });
    }
}))

app.use("/api/media", createProxyMiddleware({
    target: SERVICES.MEDIA,
    changeOrigin: true,
    pathRewrite:{
        "^/api/media":"" // remove base path
    },
    onError:(err: any, req: Request, res: Response) => {
        console.error("Media Service Error:", err.message);
        res.status(500).json({ error: 'Media Service is unavailable' });
    }
}))



app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});


app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Handler:", error.message);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message 
        // message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
})


app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('🔗 Service URLs:', SERVICES);
});