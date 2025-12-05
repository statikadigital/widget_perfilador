import re

# Leer el archivo
with open('simulador.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer sección - buscar desde <section class="perfil "> hasta </section>
section_match = re.search(r'<section class="perfil ">.*?</section>', content, re.DOTALL)
if section_match:
    section = section_match.group(0).replace('id="myChart0"', 'id="myChart"')
else:
    section = ''
    print('ERROR: No se encontró la sección')

# Extraer estilos - buscar desde <style media="screen" que contiene .perfil hasta </style>
# Buscar el bloque de estilos que comienza con .perfil
styles_start = content.find('<style media="screen" type="text/css">')
if styles_start != -1:
    # Buscar el siguiente bloque que contiene .perfil
    temp_content = content[styles_start:]
    perfil_start = temp_content.find('.perfil {')
    if perfil_start != -1:
        # Encontrar el cierre de </style> más cercano después de .perfil
        styles_end = temp_content.find('</style>', perfil_start)
        if styles_end != -1:
            styles = temp_content[:styles_end + 8]
        else:
            styles = ''
            print('ERROR: No se encontró el cierre de estilos')
    else:
        styles = ''
        print('ERROR: No se encontró .perfil en estilos')
else:
    styles = ''
    print('ERROR: No se encontró el bloque de estilos')

# Extraer script - buscar desde <script> que contiene (() => { hasta })();
script_start = content.find('<script>')
if script_start != -1:
    script_content = content[script_start:]
    # Buscar el patrón (() => {
    iife_start = script_content.find('(() => {')
    if iife_start != -1:
        # Buscar el cierre })();
        iife_end = script_content.find('})();', iife_start)
        if iife_end != -1:
            script_end = script_content.find('</script>', iife_end)
            if script_end != -1:
                script = script_content[:script_end + 9]
            else:
                script = ''
                print('ERROR: No se encontró el cierre del script')
        else:
            script = ''
            print('ERROR: No se encontró el cierre })();')
    else:
        script = ''
        print('ERROR: No se encontró (() => {')
else:
    script = ''
    print('ERROR: No se encontró <script>')

# Construir HTML completo
html = f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulador - Sección Perfil</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
{styles}
</head>
<body>
{section}
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
{script}
</body>
</html>'''

# Guardar archivo
with open('simulador_perfil_extracto.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Archivo creado exitosamente: simulador_perfil_extracto.html')

