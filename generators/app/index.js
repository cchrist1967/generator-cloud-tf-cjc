'use strict';
var Generator = require('yeoman-generator');
const { exec } = require('child_process');
const os = require('os');
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  async prompting() {
    this.log(
      yosay(
        `Welcome to the ${chalk.red(
          "generator-cloud-tf-cjc"
        )} generator!`
      )
    );

    this.log(`Your Operating System: ${chalk.blue(os.platform(), os.type(), os.release())}`);

    // PROJECT QUESTIONS
    const project_questions = [
      {
        type: "input",
        name: "stack",
        message: "Your project stack.  Must be a string with no spaces.",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "description",
        message: "Please provide a description of this project stack.",
        store: true
      },
      {
        type: "input",
        name: "project",
        message: "The name of this project (no spaces - e.g. cloud-project):",
        store: true
      },
      {
        type: "input",
        name: "program",
        message: "The name of the program to which this project belongs (no spaces - e.g. slalom-cloud):",
        store: true
      }
    ]

    // ENVIRONMENT QUESTIONS
    const env_questions = [
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
    ]

    // CLOUD PROVIDER SELECTION
    const cloud_questions = [
      {
        type: 'list',
        name: 'cloud',
        message: 'Select Cloud Provider:',
        choices: [
          {
            name: 'Azure',
            value: 'azurerm',
          }, {
            name: 'AWS',
            value: 'aws'
          }
        ]
      }
    ]

    const aws_questions = [
      {
        type: 'list',
        name: 'region',
        message: 'Select default AWS Region:',
        choices: [
          {
            name: 'US East 2 (Ohio)',
            value: 'us-east-2',
          }, {
            name: 'US East 1 (N. Virginia)',
            value: 'us-east-1'
          }, {
            name: 'US West 1 (N. California)',
            value: 'us-west-1'
          }, {
            name: 'US West 2 (Oregon)',
            value: 'us-west-2'
          }, {
            name: 'Canada (Central)',
            value: 'ca-central-1'
          }
        ],
        store: true
      }      
    ]

    const azurerm_questions = [
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
    ]

    // TOOLS/CONFIGURATION QUESTIONS
    const tool_questions = [
      {
        type: "confirm",
        name: "precommit",
        message: "Would you like to install/reinstall the pre-commit checks? (n will skip but not unistall)"
      },
      {
        type: "confirm",
        name: "gitflow",
        message: "Would you like to configure/reconfigure git flow as a branching strategy? (n will skip but not unconfigure)"
      },
      {
        type: "confirm",
        name: "atlantis",
        message: "Would you like Atlantis workflow configured/reconfigured for this project? (n will skip but not unconfigure)"
      }
    ]

    // TAGGING QUESTIONS
    const tag_questions = [
      {
        type: "input",
        name: "name",
        message: "Your first and last name:",
        store: true
      },
      {
        type: "input",
        name: "manager",
        message: "Your Manager's name:",
        store: true
      },
      {
        type: "input",
        name: "market",
        message: "Your market:",
        default: "Boston Build",
        store: true
      },
      {
        type: "input",
        name: "client",
        message: "Name of client/customer:",
        store: true
      },
      {
        type: "input",
        name: "owner",
        message: "Who owns the resources created by this stack?",
        store: true
      }
    ]

    // ASK PROJECT QUESTIONS
    this.log(`${chalk.cyan("PROJECT INFO:")}`)
    this.project_answers = await this.prompt(project_questions);

    // ASK CLOUD QUESTIONS
    this.log(`${chalk.cyan("CLOUD PROVIDER")}`)
    this.cloud_answers = await this.prompt(cloud_questions);
    switch (this.cloud_answers.cloud) {
      case 'azurerm':
        this.cloud_answers2 = await this.prompt(azurerm_questions);
        break;
      case 'aws':
        this.cloud_answers2 = await this.prompt(aws_questions);
        break;
    }

    // ASK ENVIRONMENT QUESTIONS
    this.log(`${chalk.cyan("SUPPORTED ENVIRONMENTS:")}`)
    this.env_answers = await this.prompt(env_questions);

    // ASK TOOLING QUESTIONS
    this.log(`${chalk.cyan("TOOL INSTALLATION/CONFIGURATION:")}`)
    this.tool_answers = await this.prompt(tool_questions);

    // ASK TAGGING QUESTIONS
    this.log(`${chalk.cyan("TAGS:")}`)
    this.tag_answers = await this.prompt(tag_questions);

  }

  writing() {

    // CLOUD PROVIDER CONFIGURATION
    var tf_backend;
    var cloud_provider_version;
    var backend_template;
    if (this.cloud_answers.cloud === "azurerm") {
      backend_template = "backends/azurerm-backend",
      cloud_provider_version = "2.50"
      tf_backend =  this.cloud_answers.cloud
    }
    if (this.cloud_answers.cloud === "aws") {
      backend_template = "backends/aws-backend",
      cloud_provider_version = "3.0"
      tf_backend =  "s3"
    }

    // TERRAFORM TEMPLATES
    this.fs.copyTpl(
      this.templatePath('main.tf'),
      this.destinationPath('main.tf'),
      {
        cloud_provider: this.cloud_answers.cloud,
        cloud_provider_version: unescape(cloud_provider_version),
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
        project: this.project_answers.project,
        name:    this.tag_answers.name,
        manager: this.tag_answers.manager,
        market:  this.tag_answers.market,
        owner:   this.tag_answers.owner,
        client:  this.tag_answers.client
      }
    );

    // ATLANTIS PROJECT & WORKFLOW CONFIGURATION
    if (this.tool_answers.atlantis) {
      this.fs.copyTpl(
        this.templatePath('atlantis.yaml'),
        this.destinationPath('atlantis.yaml'),
        {
          stack: this.project_answers.stack
        }
      );
      this.fs.copy(
        this.templatePath('scripts'),
        this.destinationPath('scripts')
      );
    };

    // REPO CONFIG
    this.fs.copy(
      this.templatePath('.gitignore.tpl'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { overview: this.project_answers.description }
    );

    if (this.tool_answers.precommit) {
      this.fs.copy(
        this.templatePath('.pre-commit-config.yaml'),
        this.destinationPath('.pre-commit-config.yaml')
      )
    };

    for (var env of this.env_answers.environments) {
      // TERRAFORM PARAMETERS
      this.fs.copyTpl(
        this.templatePath('parameters/env.tfvars'),
        this.destinationPath('parameters/<%= env %>.tfvars'),
        { 
          env: env,
          region: this.cloud_answers2.region
        }
      );
      this.fs.copyTpl(
        this.templatePath('parameters/env-stack.tfvars'),
        this.destinationPath('parameters/<%= env %>-<%= stack %>.tfvars'),
        { 
          env: env,
          stack: this.project_answers.stack
        }
      );

      this.fs.copyTpl(
        this.templatePath('backends/env-stack-backend-key'),
        this.destinationPath('backends/<%= env %>-<%= stack %>-backend-key'),
        { 
          env: env,
          stack: this.project_answers.stack
        }
      );

      // TERRAFORM BACKENDS
      var backend_env = [];
      var i;
      if (['dev', 'qa', 'sit'].includes(env)) {
        backend_env.push("lower")
      };
      if (['uat', 'prod'].includes(env)) {
        backend_env.push("upper")
      };
      for (i = 0; i < backend_env.length; i++) {
        this.fs.copyTpl(
          this.templatePath(backend_template),
          this.destinationPath('backends/<%= env %>-backend'),
          { 
            cloud: this.cloud_answers.cloud,
            env: env,
            client: this.tag_answers.client.toLowerCase(),
            program: this.project_answers.program.toLowerCase(),
            backend_env: backend_env[i],
            backend_region: this.cloud_answers2.region
          }
        )
      }

    }
  }

  install() {
    if (this.tool_answers.gitflow) {
      this.log("\n\n")
      this.log(`${chalk.cyan("INSTALLING GIT FLOW INITIALIZING GIT REPO")}`)
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "update"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "git-flow"])
      }
      this.log(`${chalk.cyan("INITIALIZING GIT REPO with GIT FLOW")}`)
      this.spawnCommandSync("git", ["flow", "init"])
    } else {
      this.log(`${chalk.cyan("INITIALIZING GIT REPO")}`)
      this.log("\n\n*** INITIALIZING GIT REPO ***")
      this.spawnCommandSync("git", ["init"])      
    }
    this.spawnCommandSync("git", ["add", "."])   
    this.spawnCommandSync("git", ["commit", "-am", "First Commit"])   
    if (this.tool_answers.precommit) {
      this.log("\n\n");
      this.log(`${chalk.cyan("INSTALLING PRE-COMMIT TOOLS")}`)
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "install", "python3-pip"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "terraform=0.12.30"])
      }
      this.spawnCommandSync("pip3", ["install", "pre-commit"])
      this.spawnCommandSync("pip3", ["install", "checkov"])
      this.log(`${chalk.cyan("RUNNING PRE-COMMIT CHECKS")}`)
      this.spawnCommandSync("pre-commit", ["run", "-a"])
    }
  }

};

