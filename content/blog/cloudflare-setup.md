---
title: 'Menambahkan Cloudflare: CDN & Security untuk Aplikasi Web'
description: 'Panduan lengkap mengintegrasikan Cloudflare untuk meningkatkan kecepatan (CDN), keamanan (DDoS protection), dan SSL/TLS gratis pada aplikasi web.'
date: '2024-11-15'
author: 'Your Name'
tags: ['Cloudflare', 'CDN', 'Security', 'DevOps', 'Infrastructure']
image: '/blog/cloudflare.jpg'
---

# Menambahkan Cloudflare: CDN & Security untuk Aplikasi Web

Cloudflare adalah salah satu **must-have tools** untuk setiap web developer yang peduli dengan performance dan security. Di artikel ini, aku akan share cara setup Cloudflare dari nol sampai production-ready.

## Why Cloudflare?

Cloudflare memberikan 3 benefit utama secara **gratis**:

1. **Global CDN** - Konten di-cache di 200+ data centers worldwide
2. **DDoS Protection** - Automatic protection dari serangan DDoS
3. **Free SSL/TLS** - HTTPS gratis tanpa perlu beli certificate

Plus fitur bonus: Analytics, Page Rules, Workers, dan masih banyak lagi.

## Setup Cloudflare: Step by Step

### Step 1: Sign Up & Add Site

1. Daftar di [cloudflare.com](https://cloudflare.com)
2. Click "Add a Site"
3. Masukkan domain kamu (contoh: `example.com`)
4. Pilih plan **Free** (sudah cukup powerful!)

### Step 2: Update Nameservers

Cloudflare akan memberikan 2 nameserver addresses:

```
ns1.cloudflare.com
ns2.cloudflare.com
```

Update nameservers di domain registrar kamu (GoDaddy, Namecheap, dll):
- Login ke domain registrar
- Cari settings DNS/Nameservers
- Replace dengan nameserver Cloudflare
- Save changes

**Note:** Propagasi DNS bisa memakan waktu 24-48 jam, tapi biasanya selesai dalam beberapa jam.

### Step 3: Konfigurasi DNS Records

Di Cloudflare dashboard → DNS:

```
Type    Name    Content              Proxy Status
A       @       YOUR_SERVER_IP       Proxied 🟠
A       www     YOUR_SERVER_IP       Proxied 🟠
CNAME   api     api.yourdomain.com   Proxied 🟠
```

**Proxied (🟠)** = Traffic lewat Cloudflare (CDN + Security)  
**DNS Only** = Direct ke server

### Step 4: Enable SSL/TLS

Di Cloudflare → SSL/TLS:

1. Set mode ke **Full (strict)** untuk maximum security
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

Di server kamu, install SSL certificate. Untuk Nginx + Let's Encrypt:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

### Step 5: Setup Caching Rules

Di Cloudflare → Caching:

**Browser Cache TTL:** 4 hours  
**Caching Level:** Standard

Create **Page Rule** untuk static assets:

```
URL Pattern: *.example.com/assets/*
Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 month
```

### Step 6: Security Settings

Di Cloudflare → Security:

1. **Security Level:** Medium (adjust based on traffic)
2. **Challenge Passage:** 30 minutes
3. Enable **Bot Fight Mode** (Free plan)
4. Create **Firewall Rules** jika perlu block specific countries/IPs

## Performance Improvements

Setelah setup Cloudflare di salah satu project client, aku measure improvement:

**Before Cloudflare:**
- TTFB (Jakarta): ~800ms
- TTFB (Singapore): ~200ms
- SSL/TLS: None

**After Cloudflare:**
- TTFB (Jakarta): ~120ms (85% faster!)
- TTFB (Singapore): ~45ms (77% faster!)
- SSL/TLS: A+ rating
- DDoS Protection: Active

## Best Practices & Tips

### 1. Gunakan Page Rules Secara Bijak
Free plan dapat 3 page rules. Gunakan untuk:
- Cache static assets
- Redirect www → non-www (atau sebaliknya)
- Bypass cache untuk admin panel

### 2. Monitor Analytics
Cloudflare Analytics menunjukkan:
- Traffic patterns
- Threats blocked
- Bandwidth saved via CDN

### 3. Setup Origin Server Rules
Di server kamu, whitelist Cloudflare IPs dan block direct access:

```nginx
# Nginx config
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
# ... add all Cloudflare IP ranges
real_ip_header CF-Connecting-IP;
```

### 4. Enable Development Mode saat Deploy
Saat deploy changes, enable "Development Mode" (3 hours) untuk bypass cache dan test langsung.

## Common Pitfalls

❌ **Jangan proxy API yang perlu real-time data**  
Untuk WebSocket atau real-time API, set DNS ke "DNS Only"

❌ **Jangan set Browser Cache TTL terlalu tinggi**  
Kalau kamu sering update content, gunakan nilai yang reasonable (4-8 hours)

❌ **Jangan lupa purge cache setelah deploy**  
Cloudflare → Caching → Purge Everything

## Kesimpulan

Cloudflare adalah **game-changer** untuk performance dan security web apps. Dengan setup yang benar, kamu dapat:

- **85% faster** load times via global CDN
- **Free SSL/TLS** certificates
- **Automatic DDoS protection**
- **Better SEO** karena faster site speed

Free plan sudah sangat powerful untuk sebagian besar use cases. Pro plan ($20/month) worth it jika kamu butuh lebih banyak Page Rules dan features advanced.

**Next Steps:**
- Setup Cloudflare untuk semua production apps
- Explore Cloudflare Workers untuk serverless functions
- Implement WAF (Web Application Firewall) rules

Questions? Hit me up! 🚀
