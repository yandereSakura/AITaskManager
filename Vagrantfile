Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.boot_timeout = 600

  # Порты виртуальной машины доступны на твоём компьютере
  config.vm.network "forwarded_port", guest: 5000, host: 5000
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  # Скрипт, который выполнится при первом запуске машины
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    apt-get install -y git
    curl -fsSL https://get.docker.com | sh
    git clone https://github.com/yandereSakura/AITaskManager.git /opt/app
    cd /opt/app
    docker compose up -d --build
  SHELL
end