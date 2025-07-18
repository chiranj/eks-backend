# with C# app

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 443, listenOptions =>
    {
        listenOptions.UseHttps(httpsOptions =>
        {
            httpsOptions.ServerCertificate = X509Certificate2.CreateFromPemFile(
                "/app/certs/fullchain.crt", 
                "/app/certs/private.key");
        });
    });
});

```

```json
builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 443, listenOptions =>
    {
        listenOptions.UseHttps(httpsOptions =>
        {
            httpsOptions.ServerCertificate = X509Certificate2.CreateFromPemFile(
                "/app/certs/fullchain.crt", 
                "/app/certs/private.key");
        });
    });
});
```



# Nginx Approach
```nginx
events {
    worker_connections 1024;
}

http {
    upstream csharp_app {
        server host.docker.internal:8080;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        return 301 https://$host$request_uri;
    }

    # HTTPS with SSL termination
    server {
        listen 443 ssl;
        
        ssl_certificate /etc/nginx/certs/certificate.crt;
        ssl_certificate_key /etc/nginx/certs/private.key;
        
        location / {
            proxy_pass http://csharp_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

```dockerfile

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
```

```bash
docker run -d \
  --name nginx-ssl \
  -p 80:80 \
  -p 443:443 \
  -v /etc/ssl/certs/your-app:/etc/nginx/certs:ro \
  nginx-ssl
```
