from rest_framework import serializers
from api.models import Telemetria, LANGUAGE_CHOICES, STYLE_CHOICES

class TelemetriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telemetria
        fields = [
            'id', 'tipo', 'captura_data_hora', 'registro_data_hora',
            'envio_tentativa_data_hora', 'envio_data_hora', 'placa', 
            'placa_tipo', 'placa_totalmente_reconhecida', 'sentido',
            'camera_nome', 'camera_codigo', 'veiculo_tipo', 'veiculo_cor',
            'velocidade', 'velocidade', 'faixa', 'ultimo_enviado_id',
            'arquivo_nome', 'status_cpu', 'status_ram', 'status_disco',
            'status_rede', 'ping_sefaz', 'ping_camera', 'camera_latitude',
            'camera_longitude', 'camera_endereco', 'created_at'
        ]
