'use strict';
var Generator = require('yeoman-generator');
const { exec } = require('child_process');
var os = require('os');
var backend_client;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  async prompting() {
    this.log("OS: ", os.platform(), " ", os.type(), " ", os.release())
    this.answers = await this.prompt([
      {
        type: "input",
        name: "stack",
        message: "Your project stack.  Must be a string with no spaces.",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "overview",
        message: "Please provide a description of this project stack.",
        store: true
      },
      {
        type: "input",
        name: "name",
        message: "Your first and last name",
        store: true
      },
      {
        type: "input",
        name: "nanager",
        message: "Your Manager's name",
        store: true
      },
      {
        type: "input",
        name: "narket",
        message: "Your market",
        store: true
      },
      {
        type: "input",
        name: "project",
        message: "The name of this project",
        store: true
      },
      {
        type: "input",
        name: "program",
        message: "The name of the program to which this project belongs",
        store: true
      },
      {
        type: "input",
        name: "owner",
        message: "Who owns the resources created by this stack?",
        store: true
      },
      {
        type: "input",
        name: "client",
        message: "Name of client/customer",
        store: true
      },
      {
        type: "confirm",
        name: "precommit",
        message: "Would you like to install the pre-commit checks?"
      },
      {
        type: "confirm",
        name: "gitflow",
        message: "Would you like to use git flow as a branching strategy?"
      },
      {
        type: 'list',
        name: 'cloud',
        message: 'Select Cloud Provider:',
        choices: [
          {
            name: 'Azure',
            value: 'azure',
          }, {
            name: 'AWS',
            value: 'aws'
          }
        ]
      },
      {
        type: 'checkbox',
        name: 'environments',
        message: 'Select all environments you want to support:',
        choices: [
          {
            name: 'dev',
            value: 'dev',
            checked: true
          }, {
            name: 'qa',
            value: 'qa'

          }, {
            name: 'sit',
            value: 'sit'
          }, {
            name: 'uat',
            value: 'uat'
          }, {
            name: 'prod',
            value: 'prod',
            checked: true
          }
    
        ],
        store: true
      }
      
    ]);

    this.backend_client = this.answers.client.toLowerCase();

    if (this.answers.cloud === "azure") {
      this.answers2 = await this.prompt([
        {
          type: 'list',
          name: 'region',
          message: 'Select default Azure Region:',
          choices: [
            {
              name: 'Central US',
              value: 'Central US',
            }, {
              name: 'East US',
              value: 'East US'
            }, {
              name: 'East US 2',
              value: 'East US 2'
            }, {
              name: 'North Central US',
              value: 'North Central US'
            }, {
              name: 'South Central US',
              value: 'South Central US'
            }, {
              name: 'West Central US',
              value: 'West Central US'
            }, {
              name: 'WEST US',
              value: 'WEST US'
            }, {
              name: 'WEST US 2',
              value: 'WEST US 2'
            }
          ],
          store: true
        }
      ])
    } else {
      this.answers2 = await this.prompt([
        {
          type: 'list',
          name: 'region',
          message: 'Select default AWS Region:',
          choices: [
            {
              name: 'US East (Ohio)',
              value: 'us-east-2',
            }, {
              name: 'US East (N. Virginia)',
              value: 'us-east-1'
            }, {
              name: 'US West (N. California)',
              value: 'us-west-1'
            }, {
              name: 'US West (Oregon)',
              value: 'us-west-2'
            }, {
              name: 'Canada (Central)',
              value: 'ca-central-1'
            }
          ],
          store: true
        }
      ])      
    }

  }


  writing() {

    var tf_backend;
    var cloud_provider_version;
    if (this.answers.cloud === "azurerm") {
      cloud_provider_version = "~> 2.50"
      tf_backend =  this.answers.cloud
    }
    if (this.answers.cloud === "aws") {
      cloud_provider_version = "~> 3.0"
      tf_backend =  "s3"
    }

    // TERRAFORM TEMPLATES
    this.fs.copyTpl(
      this.templatePath('main.tf'),
      this.destinationPath('main.tf'),
      {
        cloud_provider: this.answers.cloud,
        tf_backend: tf_backend
      }
    );

    this.fs.copy(
      this.templatePath('outputs.tf'),
      this.destinationPath('outputs.tf')
    );

    this.fs.copyTpl(
      this.templatePath('variables.tf'),
      this.destinationPath('variables.tf'),
      {
        name:    this.answers.name,
        manager: this.answers.manager,
        market:  this.answers.market,
        project: this.answers.project,
        owner:   this.answers.owner,
        client:  this.answers.client
      }
    );

    // ATLANTIS PROJECT & WORKFLOW CONFIGURATION
    this.fs.copy(
      this.templatePath('atlantis.yaml'),
      this.destinationPath('atlantis.yaml')
    );

    this.fs.copy(
      this.templatePath('scripts'),
      this.destinationPath('scripts')
    );


    // REPO CONFIG
    this.fs.copy(
      this.templatePath('.gitignore.tpl'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { overview: this.answers.overview }
    );

    if (this.answers.precommit) {
      this.fs.copy(
        this.templatePath('.pre-commit-config.yaml'),
        this.destinationPath('.pre-commit-config.yaml')
      )
    }

    for (var env of this.answers.environments) {
      // TERRAFORM PARAMETERS
      this.fs.copyTpl(
        this.templatePath('parameters/env.tfvars'),
        this.destinationPath('parameters/<%= env %>.tfvars'),
        { 
          env: env,
          region: this.answers2.region
        }
      );
      this.fs.copyTpl(
        this.templatePath('parameters/env-stack.tfvars'),
        this.destinationPath('parameters/<%= env %>-<%= stack %>.tfvars'),
        { 
          env: env,
          stack: this.answers.stack
        }
      );

      this.fs.copyTpl(
        this.templatePath('backends/env-stack-backend-key'),
        this.destinationPath('backends/<%= env %>-<%= stack %>-backend-key'),
        { 
          env: env,
          stack: this.answers.stack
        }
      );

      // TERRAFORM BACKENDS
      var backend_env;
      if (['dev', 'qa', 'sit'].includes(env)) {
        backend_env = "lower"
      }
      if (['uat', 'prod'].includes(env)) {
        backend_env = "upper"
      }
      this.fs.copyTpl(
        this.templatePath('backends/<%= cloud %>-backend'),
        this.destinationPath('backends/<%= env %>-backend'),
        { 
          cloud: this.answers.cloud,
          env: env,
          company: this.answers.company.toLowerCase(),
          program: this.answers.program.toLowerCase(),
          backend_env: backend_env,
          region: this.answers2.region
        }
      )

    }
  }

  install() {
    if (this.answers.gitflow) {
      this.log("\n\n*** INSTALLING GIT FLOW & INITIALIZING GIT REPO ***")
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "update"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "git-flow"])
      }
      this.spawnCommandSync("git", ["flow", "init"])
    } else {
      this.log("\n\n*** INITIALIZING GIT REPO ***")
      this.spawnCommandSync("git", ["init"])      
    }
    this.spawnCommandSync("git", ["add", "."])   
    if (this.answers.precommit) {
      this.log("\n\n*** INSTALLING PRE-COMMIT TOOLS ***")
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "install", "python3-pip"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "terraform=0.12.30"])
      }
      this.spawnCommandSync("pip3", ["install", "pre-commit"])
      this.spawnCommandSync("pip3", ["install", "checkov"])
      this.spawnCommandSync("pre-commit", ["run", "-a"])
    }
  }

};

