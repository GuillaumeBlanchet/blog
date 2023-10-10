# Synchroniser les données Salesforce avec votre système 

## Introduction

Salesforce est une des systèmes CRM les plus puissantes
sur le marché. Cette plateforme "low-code" peut remplacer un département TI au complet en offrant 
un site web permettant de gérer vos clients, votre facturation, vos campagnes marketing,
vos interventions sur le terrain, et bien plus.

Même s'il peut gérer tout votre "back office", il ne pourra pas remplacer votre image 
de marque ou certain de vos systèmes au coeur de votre modèle d'affaire.
L'intégration des données Salesforce est donc un travail fondamental pour présenter à vos clients des
produits sur mesure tout en transférant leurs données au CRM pour assurer la cohérence de votre 
donnée dans vos systèmes.

## Installer le Salesforce CLI ("sf")

La première étape pour travailler avec la donnée Salesforce efficacement 
[est d'installer "sf"](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm).

Cet outil en ligne de commande vous permettra de tester rapidement vos requêtes au CRM, exemple:

    sf org login web
    sf org list
    sf data query --query "SELECT Id, Name, Account.Name FROM Contact" -o <ORG_USERNAME>

Ces trois commandes vous permettent de vous connecter à votre instance Salesforce, de consulter les détails de
votre organisation et enfin de vous connecter avec ces détails pour exécuter une requête. Voici sur une instance de tests 
[developpeur](https://developer.salesforce.com/signup/) ce que ça donne:

![sf](./img/sf.png)

Comme on voit, Salesforce vous rend service en créant l'instance avec de la donnée déjà prépopulée. 

## Programmer la synchronisation grâce au REST API de Salesforce

Un fois que vous avez tester les requêtes qui pourront être utiliser dans votre programme de synchronisation avec 
`sf`, il ne vous reste plus qu'à programmer le code qui exécutera ces requêtes pour opérer la synchronisation.

Évidemment, contacter le REST API directement demanderait de recoder les objets de données de transfert (DTOs), ce qu'on 
veut éviter. Salesforce fournit un excellent wrapper NodeJs (https://github.com/jsforce/jsforce) pour son API et c'est celui que je vous conseille 
pour plusieurs raisons:

- [Salesforce recommande cet écosystème](https://developer.salesforce.com/blogs/2021/01/what-is-node-js-and-why-does-it-matter-as-a-salesforce-developer);
- `sf` a été codé avec NodeJS;
- [C'est un des 2 seuls wrappers proposés par la documentation du système](https://trailhead.salesforce.com/content/learn/modules/api_basics/api_basics_rest);
- jsforce est maintenu par Salesforce contrairement à d'autres wrappers dans les autres langages de programmation important (exemple: https://github.com/simple-salesforce/simple-salesforce)
- la documentation est supérieure aux autres wrapper, car vous avez [un site dédiée à la doc de jsforce](https://jsforce.github.io/)

