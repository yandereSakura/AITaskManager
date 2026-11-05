Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.box_check_update = false
  config.vm.boot_timeout = 600

  config.vm.network "forwarded_port", guest: 5000, host: 5000   # backend, метрики, MFA
  config.vm.network "forwarded_port", guest: 3000, host: 3000   # сайт
  config.vm.network "forwarded_port", guest: 9090, host: 9090   # Prometheus
  config.vm.network "forwarded_port", guest: 3001, host: 3001   # Grafana

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 3072
    vb.cpus = 2
    vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    apt-get install -y git
    command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh
    if [ -d /opt/app/.git ]; then
      git -C /opt/app pull
    else
      git clone https://github.com/yandereSakura/AITaskManager.git /opt/app
    fi
    cd /opt/app
    docker compose up -d --build
  SHELL
end
