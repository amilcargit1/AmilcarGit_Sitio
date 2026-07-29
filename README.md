# AMILCARGIT OFICIAL

Sitio de presentación estático (HTML/CSS/JS puro, sin build) con identidad
visual de "documento oficial": credencial, sello y formulario tipo trámite.

## Antes de publicar — reemplazar

- [ ] `index.html` → bio en `.card-bio`, rol y sede en la credencial
- [ ] `index.html` → email, WhatsApp e Instagram en la sección de contacto
- [ ] `index.html` → `action="https://formspree.io/f/REEMPLAZAR_ID"` por tu
      endpoint real de [Formspree](https://formspree.io) (te registrás gratis,
      creás un formulario y te dan un ID)
- [ ] `index.html` → título/meta description si querés ajustarlos
- [ ] Foto: reemplazar el bloque `.card-photo` por una `<img>` cuando tengas
      la imagen definitiva

## Subir a GitHub

```bash
cd amilcargit-oficial
git init
git add .
git commit -m "Sitio inicial AMILCARGIT OFICIAL"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/amilcargit-oficial.git
git push -u origin main
```

(Creá el repo vacío en GitHub primero, sin README, para que el push no choque.)

## Desplegar en Render

1. Entrá a [render.com](https://render.com) y logueate con GitHub.
2. **New +** → **Static Site**.
3. Elegí el repo `amilcargit-oficial`.
4. Configuración:
   - **Build Command:** dejar vacío (no hay build)
   - **Publish directory:** `.` (raíz del repo)
5. **Create Static Site**. Render te da una URL tipo
   `amilcargit-oficial.onrender.com` y se redeploya solo con cada push.

## Estructura

```
index.html   → toda la estructura y el contenido
style.css    → identidad visual (paleta, tipografía, layout)
script.js    → envío del formulario de contacto
```
